import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersOutboxMessageTypeOrmEntity } from './outbox-message.entity';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  USERS_OUTBOX_MESSAGE_PROCESSOR_JOB,
  USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE,
} from './outbox.config';
import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  EVENT_BUS_ADAPTER_TOKEN,
  EventBusAdapter,
} from 'src/modules/common/application/event-bus/event-bus.adapter';

@Injectable()
@Processor(USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE)
export class OutboxMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxMessageProcessor.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(OUTBOX_CONFIG_TOKEN)
    private readonly outboxConfigs: OutboxConfig,
    @Inject(EVENT_BUS_ADAPTER_TOKEN) private readonly eventBus: EventBusAdapter,
  ) {
    super();
  }

  async process() {
    this.logger.log(`${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Starting outbox message processing`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock unprocessed rows (FOR UPDATE SKIP LOCKED)
      const outboxMessages = await queryRunner.manager
        .createQueryBuilder(UsersOutboxMessageTypeOrmEntity, 'msg')
        .where('msg.processedAt IS NULL')
        .orderBy('msg.createdAt', 'ASC')
        .limit(this.outboxConfigs.batchSize)
        .setLock('pessimistic_write')
        .getMany();

      this.logger.debug(
        `${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Fetched ${outboxMessages.length} messages`,
      );

      const successfullyProcessedIds: string[] = [];

      for (const message of outboxMessages) {
        try {
          const rawContent = message.content;
          const event = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

          await this.eventBus.publish([event]);

          successfullyProcessedIds.push(message.id);
        } catch (err) {
          this.logger.error(
            `${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB} - Failed to process message ${message.id}`,
            err instanceof Error ? err.stack : String(err),
          );
        }
      }

      // Batch update outside the loop
      if (successfullyProcessedIds.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(UsersOutboxMessageTypeOrmEntity)
          .set({ processedAt: Date.now() })
          .whereInIds(successfullyProcessedIds)
          .execute();

        this.logger.log(
          `${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB} - Successfully marked ${successfullyProcessedIds.length} messages as processed.`,
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(`${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Completed outbox processing`);
    } catch (err) {
      this.logger.error(`${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Transaction failed`, err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

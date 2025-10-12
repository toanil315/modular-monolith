import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersOutboxMessageTypeOrmEntity } from './outbox-message.entity';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { OUTBOX_MESSAGE_PROCESSOR_JOB, OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE } from './outbox.config';
import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { EventBus } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  DOMAIN_EVENT_REGISTRY_TOKEN,
  DomainEventRegistry,
} from 'src/modules/common/infrastructure/outbox/domain-event.registry';

@Injectable()
@Processor(OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE)
export class OutboxMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxMessageProcessor.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(DOMAIN_EVENT_REGISTRY_TOKEN)
    private readonly eventRegistry: DomainEventRegistry,
    @Inject(OUTBOX_CONFIG_TOKEN)
    private readonly outboxConfigs: OutboxConfig,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async process() {
    this.logger.log(`${OUTBOX_MESSAGE_PROCESSOR_JOB}: Starting outbox message processing`);

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
        `${OUTBOX_MESSAGE_PROCESSOR_JOB}: Fetched ${outboxMessages.length} messages`,
      );

      const successfullyProcessedIds: string[] = [];

      for (const message of outboxMessages) {
        try {
          const rawContent = message.content;
          const parseContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

          const EventCtor = this.eventRegistry.get(message.type);

          if (!EventCtor) {
            throw new Error(`Unknown domain event type: ${message.type}`);
          }

          const domainEvent = new EventCtor();

          for (const key in domainEvent) {
            domainEvent[key] = parseContent[key];
          }

          await this.eventBus.publish(domainEvent);

          successfullyProcessedIds.push(message.id);
        } catch (err) {
          this.logger.error(
            `${OUTBOX_MESSAGE_PROCESSOR_JOB} - Failed to process message ${message.id}`,
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
          `${OUTBOX_MESSAGE_PROCESSOR_JOB} - Successfully marked ${successfullyProcessedIds.length} messages as processed.`,
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(`${OUTBOX_MESSAGE_PROCESSOR_JOB}: Completed outbox processing`);
    } catch (err) {
      this.logger.error(`${OUTBOX_MESSAGE_PROCESSOR_JOB}: Transaction failed`, err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

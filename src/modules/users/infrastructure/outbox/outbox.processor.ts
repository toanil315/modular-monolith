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
import { context, propagation, trace } from '@opentelemetry/api';

@Injectable()
@Processor(USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE)
export class OutboxMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxMessageProcessor.name);
  private readonly tracer = trace.getTracer('users-module-outbox-job-processor');

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
      const outboxMessages = await queryRunner.manager
        .createQueryBuilder(UsersOutboxMessageTypeOrmEntity, 'msg')
        .where('msg.processedAt IS NULL')
        .orderBy('msg.createdAt', 'ASC')
        .limit(this.outboxConfigs.batchSize)
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getMany();

      this.logger.debug(
        `${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Fetched ${outboxMessages.length} messages`,
      );

      if (!outboxMessages.length) return;

      return await this.tracer.startActiveSpan(
        'users.outbox-processor.job',
        {
          attributes: {
            'outbox.batch.size': outboxMessages.length,
          },
        },
        async (batchSpan) => {
          const successfullyProcessedIds: string[] = [];
          try {
            for (const message of outboxMessages) {
              await this.processMessage(message);
              successfullyProcessedIds.push(message.id);
            }

            if (successfullyProcessedIds.length > 0) {
              await queryRunner.manager
                .createQueryBuilder()
                .update(UsersOutboxMessageTypeOrmEntity)
                .set({ processedAt: Date.now() })
                .whereInIds(successfullyProcessedIds)
                .execute();
            }

            await queryRunner.commitTransaction();
            this.logger.log(`${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Completed outbox processing`);
          } catch (err) {
            throw err;
          } finally {
            batchSpan.end();
          }
        },
      );
    } catch (err) {
      this.logger.error(`${USERS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Transaction failed`, err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async processMessage(message: UsersOutboxMessageTypeOrmEntity) {
    const rawContent = message.content;
    const event = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

    const otel =
      typeof message.otelContext === 'string'
        ? JSON.parse(message.otelContext)
        : message.otelContext;

    let extractedCtx = propagation.extract(context.active(), {
      traceparent: otel?.traceparent,
    });

    const span = this.tracer.startSpan('users.outbox.process_message', {
      links: [{ context: trace.getSpan(extractedCtx)?.spanContext()! }],
      attributes: {
        'outbox.message_id': message.id,
        'outbox.message_type': message.type,
        'messaging.system': 'outbox',
      },
    });

    context.with(trace.setSpan(context.active(), span), async () => {
      await this.eventBus.publish([event]);
      span.end();
    });
  }
}

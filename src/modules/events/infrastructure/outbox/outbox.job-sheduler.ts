import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import {
  EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB,
  EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE,
  EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER,
} from './outbox.config';
import { InjectQueue } from '@nestjs/bullmq';

const SECOND = 1000;

@Injectable()
export class OutboxJobScheduler implements OnModuleInit {
  private readonly logger = new Logger(OutboxJobScheduler.name);

  constructor(
    @InjectQueue(EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE)
    private readonly queue: Queue,
    @Inject(OUTBOX_CONFIG_TOKEN) private readonly outboxConfigs: OutboxConfig,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    const interval = setInterval(
      () => this.addOutboxProcessorJobIntoQueue(),
      this.outboxConfigs.interval * SECOND,
    );
    this.schedulerRegistry.addInterval(EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER, interval);
  }

  private async addOutboxProcessorJobIntoQueue() {
    try {
      await this.queue.add(
        EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB,
        {},
        {
          jobId: EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    } catch (err) {
      this.logger.error(
        `${EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB}: Failed to enqueue Outbox job: `,
        err,
      );
    }
  }
}

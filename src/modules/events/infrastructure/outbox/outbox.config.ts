import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { EventsOutboxMessageTypeOrmEntity } from './outbox-message.entity';
import { EventsOutboxConsumedMessageTypeOrmEntity } from './outbox-consumed-message.entity';

export const EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB = 'EVENTS_OUTBOX_MESSAGE_PROCESSOR';
export const EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER =
  'EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER';
export const EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE =
  'EVENTS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE';

export const EventsOutboxConfig: OutboxConfig = {
  entity: EventsOutboxMessageTypeOrmEntity,
  consumedEntity: EventsOutboxConsumedMessageTypeOrmEntity,
  interval: 15,
  batchSize: 20,
};

export const EventsOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: EventsOutboxConfig,
};

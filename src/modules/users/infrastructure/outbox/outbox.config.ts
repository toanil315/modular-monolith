import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { UsersOutboxMessageTypeOrmEntity } from './outbox-message.entity';

export const OUTBOX_MESSAGE_PROCESSOR_JOB = 'OUTBOX_MESSAGE_PROCESSOR';
export const OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER = 'OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER';
export const OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE = 'OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE';

export const UserOutboxConfig: OutboxConfig = {
  entity: UsersOutboxMessageTypeOrmEntity,
  interval: 15,
  batchSize: 20,
};

export const UserOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: UserOutboxConfig,
};

import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { UsersOutboxMessageTypeOrmEntity } from './outbox-message.entity';
import { UsersOutboxConsumedMessageTypeOrmEntity } from './outbox-consumed-message.entity';

export const USERS_OUTBOX_MESSAGE_PROCESSOR_JOB = 'USERS_OUTBOX_MESSAGE_PROCESSOR';
export const USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER =
  'USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_SCHEDULER';
export const USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE = 'USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE';

export const UserOutboxConfig: OutboxConfig = {
  entity: UsersOutboxMessageTypeOrmEntity,
  consumedEntity: UsersOutboxConsumedMessageTypeOrmEntity,
  interval: 15,
  batchSize: 20,
};

export const UserOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: UserOutboxConfig,
};

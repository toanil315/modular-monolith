import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { UsersOutboxMessageTypeOrmEntity } from './outbox-message.entity';

export const UserOutboxConfig: OutboxConfig = {
  entity: UsersOutboxMessageTypeOrmEntity,
};

export const UserOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: UserOutboxConfig,
};

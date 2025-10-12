import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { TicketingOutboxMessageTypeOrmEntity } from './outbox-message.entity';

export const TicketingOutboxConfig: OutboxConfig = {
  entity: TicketingOutboxMessageTypeOrmEntity,
};

export const TicketingOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: TicketingOutboxConfig,
};

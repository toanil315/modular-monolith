import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { TicketingOutboxMessageTypeOrmEntity } from './outbox-message.entity';
import { TicketingOutboxConsumedMessageTypeOrmEntity } from './outbox-consumed-message.entity';

export const TicketingOutboxConfig: OutboxConfig = {
  entity: TicketingOutboxMessageTypeOrmEntity,
  consumedEntity: TicketingOutboxConsumedMessageTypeOrmEntity,
  interval: 15,
  batchSize: 20,
};

export const TicketingOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: TicketingOutboxConfig,
};

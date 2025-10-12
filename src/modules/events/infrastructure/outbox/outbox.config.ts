import {
  OUTBOX_CONFIG_TOKEN,
  OutboxConfig,
} from 'src/modules/common/infrastructure/outbox/outbox.config';
import { EventsOutboxMessageTypeOrmEntity } from './outbox-message.entity';

export const EventsOutboxConfig: OutboxConfig = {
  entity: EventsOutboxMessageTypeOrmEntity,
  interval: 15,
  batchSize: 20,
};

export const EventsOutboxConfigProvider = {
  provide: OUTBOX_CONFIG_TOKEN,
  useValue: EventsOutboxConfig,
};

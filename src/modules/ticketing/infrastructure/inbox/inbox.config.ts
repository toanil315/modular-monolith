import { TicketingInboxConsumedMessageTypeOrmEntity } from './inbox-consumed-message.entity';
import {
  INBOX_CONFIG_TOKEN,
  InboxConfig,
} from 'src/modules/common/infrastructure/inbox/inbox.config';

export const TicketingInboxConfig: InboxConfig = {
  consumedEntity: TicketingInboxConsumedMessageTypeOrmEntity,
};

export const TicketingInboxConfigProvider = {
  provide: INBOX_CONFIG_TOKEN,
  useValue: TicketingInboxConfig,
};

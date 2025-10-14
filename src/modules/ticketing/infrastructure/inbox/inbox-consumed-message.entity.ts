import { Entity } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';
import { InboxConsumedMessageTypeOrmEntity } from 'src/modules/common/infrastructure/inbox/base-consumed-inbox-message.entity';

@Entity({ schema: TICKETING_SCHEMA, name: 'inbox_consumed_messages' })
export class TicketingInboxConsumedMessageTypeOrmEntity extends InboxConsumedMessageTypeOrmEntity {}

import { Entity } from 'typeorm';
import { OutboxConsumedMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-cosumed-outbox-message.entity';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'outbox_consumed_messages' })
export class TicketingOutboxConsumedMessageTypeOrmEntity extends OutboxConsumedMessageTypeOrmEntity {}

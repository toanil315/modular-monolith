import { OutboxMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-outbox-message.entity';
import { Entity } from 'typeorm';
import { TICKETING_SCHEMA } from '../database/datasource';

@Entity({ schema: TICKETING_SCHEMA, name: 'outbox_messages' })
export class TicketingOutboxMessageTypeOrmEntity extends OutboxMessageTypeOrmEntity {}

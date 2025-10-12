import { OutboxMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-outbox-message.entity';
import { Entity } from 'typeorm';
import { EVENTS_SCHEMA } from '../database/datasource';

@Entity({ schema: EVENTS_SCHEMA, name: 'outbox_messages' })
export class EventsOutboxMessageTypeOrmEntity extends OutboxMessageTypeOrmEntity {}

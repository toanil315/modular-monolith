import { Entity } from 'typeorm';
import { EVENTS_SCHEMA } from '../database/datasource';
import { OutboxConsumedMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-cosumed-outbox-message.entity';

@Entity({ schema: EVENTS_SCHEMA, name: 'outbox_consumed_messages' })
export class EventsOutboxConsumedMessageTypeOrmEntity extends OutboxConsumedMessageTypeOrmEntity {}

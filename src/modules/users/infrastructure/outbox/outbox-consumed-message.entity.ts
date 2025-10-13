import { Entity } from 'typeorm';
import { OutboxConsumedMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-cosumed-outbox-message.entity';
import { USERS_SCHEMA } from '../database/datasource';

@Entity({ schema: USERS_SCHEMA, name: 'outbox_consumed_messages' })
export class UsersOutboxConsumedMessageTypeOrmEntity extends OutboxConsumedMessageTypeOrmEntity {}

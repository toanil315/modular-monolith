import { OutboxMessageTypeOrmEntity } from 'src/modules/common/infrastructure/outbox/base-outbox-message.entity';
import { Entity } from 'typeorm';
import { USERS_SCHEMA } from '../database/datasource';

@Entity({ schema: USERS_SCHEMA, name: 'outbox_messages' })
export class UsersOutboxMessageTypeOrmEntity extends OutboxMessageTypeOrmEntity {}

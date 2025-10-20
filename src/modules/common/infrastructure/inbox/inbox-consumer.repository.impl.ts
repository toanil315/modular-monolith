import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../domain/domain-event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { INBOX_CONFIG_TOKEN, InboxConfig } from './inbox.config';
import { InboxConsumerRepository } from '../../application/messagings/inbox-consumer.repository';
import { InboxConsumedMessageTypeOrmEntity } from './base-consumed-inbox-message.entity';
import { BaseRepository } from '../database/base-repository.impl';

@Injectable()
export class InboxConsumerRepositoryImpl extends BaseRepository implements InboxConsumerRepository {
  constructor(
    @Inject(INBOX_CONFIG_TOKEN)
    private readonly config: InboxConfig,
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new InboxConsumerRepositoryImpl(this.config, manager) as this;
  }

  async isProcessed(event: DomainEvent, consumerName: string): Promise<boolean> {
    const consumedMessage = await this.manager.findOne<InboxConsumedMessageTypeOrmEntity>(
      this.config.consumedEntity,
      {
        where: {
          id: event.id,
          consumer: consumerName,
        },
      },
    );

    return Boolean(consumedMessage);
  }

  async save(event: DomainEvent, consumerName: string): Promise<void> {
    await this.manager.save(this.config.consumedEntity, {
      id: event.id,
      consumer: consumerName,
    });
  }

  async withTransaction<T>(fn: (manager: EntityManager) => Promise<T>) {
    return this.manager.transaction(async (manager) => fn(manager));
  }
}

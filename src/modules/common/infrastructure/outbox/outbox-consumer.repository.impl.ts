import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OUTBOX_CONFIG_TOKEN, OutboxConfig } from './outbox.config';
import { OutboxConsumerRepository } from '../../application/messagings/outbox-consumer.repository';
import { DomainEvent } from '../../domain/domain-event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { OutboxConsumedMessageTypeOrmEntity } from './base-cosumed-outbox-message.entity';
import { BaseRepository } from '../database/base-repository.impl';

@Injectable()
export class OutboxConsumerRepositoryImpl
  extends BaseRepository
  implements OutboxConsumerRepository
{
  constructor(
    @Inject(OUTBOX_CONFIG_TOKEN)
    private readonly config: OutboxConfig,
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {
    super();
  }

  withManager(manager: EntityManager) {
    return new OutboxConsumerRepositoryImpl(this.config, manager) as this;
  }

  async isProcessed(event: DomainEvent, consumerName: string): Promise<boolean> {
    const consumedMessage = await this.manager.findBy<OutboxConsumedMessageTypeOrmEntity>(
      this.config.consumedEntity,
      {
        id: event.id,
        consumer: consumerName,
      },
    );

    return Boolean(consumedMessage.length);
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

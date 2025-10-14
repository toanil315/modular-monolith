import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../domain/domain-event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { INBOX_CONFIG_TOKEN, InboxConfig } from './inbox.config';
import { InboxConsumerRepository } from '../../application/messagings/inbox-consumer.repository';
import { InboxConsumedMessageTypeOrmEntity } from './base-consumed-inbox-message.entity';

@Injectable()
export class InboxConsumerRepositoryImpl implements InboxConsumerRepository {
  constructor(
    @Inject(INBOX_CONFIG_TOKEN)
    private readonly config: InboxConfig,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async isProcessed(event: DomainEvent, consumerName: string): Promise<boolean> {
    const consumedMessage = await this.entityManager.findOne<InboxConsumedMessageTypeOrmEntity>(
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
    await this.entityManager.save(this.config.consumedEntity, {
      id: event.id,
      consumer: consumerName,
    });
  }
}

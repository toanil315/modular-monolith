import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OUTBOX_CONFIG_TOKEN, OutboxConfig } from './outbox.config';
import { OutboxConsumerRepository } from '../../application/messagings/outbox-consumer.repository';
import { DomainEvent } from '../../domain/domain-event';
import { IntegrationEvent } from '../../application/messagings/integration-event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { OutboxConsumedMessageTypeOrmEntity } from './base-cosumed-outbox-message.entity';

@Injectable()
export class OutboxConsumerRepositoryImpl implements OutboxConsumerRepository {
  constructor(
    @Inject(OUTBOX_CONFIG_TOKEN)
    private readonly config: OutboxConfig,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async isProcessed(event: DomainEvent | IntegrationEvent, consumerName: string): Promise<boolean> {
    const consumedMessage = await this.entityManager.findOne<OutboxConsumedMessageTypeOrmEntity>(
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

  async save(event: DomainEvent | IntegrationEvent, consumerName: string): Promise<void> {
    await this.entityManager.save(this.config.consumedEntity, {
      id: event.id,
      consumer: consumerName,
    });
  }
}

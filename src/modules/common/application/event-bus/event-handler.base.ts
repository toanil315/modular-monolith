import { Injectable } from '@nestjs/common';
import { OutboxConsumerRepository } from '../messagings/outbox-consumer.repository';
import { DomainEvent } from '../../domain/domain-event';
import { IntegrationEvent } from '../messagings/integration-event';

@Injectable()
export abstract class BaseEventHandler {
  constructor(
    protected readonly outboxConsumerRepository: OutboxConsumerRepository,
    protected readonly context: string,
  ) {}

  protected get handlerName(): string {
    return `${this.context}.${this.constructor.name}`;
  }

  protected async isProcessed(event: DomainEvent | IntegrationEvent) {
    return await this.outboxConsumerRepository.isProcessed(event, this.handlerName);
  }

  protected async saveConsumedMessage(event: DomainEvent | IntegrationEvent) {
    await this.outboxConsumerRepository.save(event, this.handlerName);
  }
}

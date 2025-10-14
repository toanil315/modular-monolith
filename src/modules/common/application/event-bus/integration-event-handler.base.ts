import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/domain-event';
import { InboxConsumerRepository } from '../messagings/inbox-consumer.repository';

@Injectable()
export abstract class BaseIntegrationEventHandler {
  constructor(
    protected readonly inboxConsumerRepository: InboxConsumerRepository,
    protected readonly context: string,
  ) {}

  protected get handlerName(): string {
    return `${this.context}.${this.constructor.name}`;
  }

  protected async isProcessed(event: DomainEvent) {
    return await this.inboxConsumerRepository.isProcessed(event, this.handlerName);
  }

  protected async saveConsumedMessage(event: DomainEvent) {
    await this.inboxConsumerRepository.save(event, this.handlerName);
  }
}

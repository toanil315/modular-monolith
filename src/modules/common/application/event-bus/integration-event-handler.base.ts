import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/domain-event';
import { InboxConsumerRepository } from '../messagings/inbox-consumer.repository';
import { EntityManager } from 'typeorm';
import { IntegrationEvent } from '../messagings/integration-event';

@Injectable()
export abstract class BaseIntegrationEventHandler {
  constructor(
    protected readonly inboxConsumerRepository: InboxConsumerRepository,
    protected readonly context: string,
  ) {}

  protected abstract handle(integrationEvent: IntegrationEvent): Promise<void>;

  protected get handlerName(): string {
    return `${this.context}.${this.constructor.name}`;
  }

  protected async withTransaction<T>(fn: (manager: EntityManager) => Promise<T>) {
    return this.inboxConsumerRepository.withTransaction(fn);
  }

  protected async isProcessed(event: DomainEvent) {
    return await this.inboxConsumerRepository.isProcessed(event, this.handlerName);
  }

  protected async saveConsumedMessage(event: DomainEvent, manager: EntityManager) {
    await this.inboxConsumerRepository.withManager(manager).save(event, this.handlerName);
  }
}

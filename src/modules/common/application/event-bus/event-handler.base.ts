import { Injectable } from '@nestjs/common';
import { OutboxConsumerRepository } from '../messagings/outbox-consumer.repository';
import { DomainEvent } from '../../domain/domain-event';
import { EntityManager } from 'typeorm';

@Injectable()
export abstract class BaseEventHandler {
  constructor(
    protected readonly outboxConsumerRepository: OutboxConsumerRepository,
    protected readonly context: string,
  ) {}

  protected abstract handle(domainEvent: DomainEvent): Promise<void>;

  protected get handlerName(): string {
    return `${this.context}.${this.constructor.name}`;
  }

  protected async withTransaction<T>(fn: (manager: EntityManager) => Promise<T>) {
    return this.outboxConsumerRepository.withTransaction(fn);
  }

  protected async isProcessed(event: DomainEvent) {
    return await this.outboxConsumerRepository.isProcessed(event, this.handlerName);
  }

  protected async saveConsumedMessage(event: DomainEvent, manager: EntityManager) {
    await this.outboxConsumerRepository.withManager(manager).save(event, this.handlerName);
  }
}

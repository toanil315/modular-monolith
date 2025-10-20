import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../domain/domain-event';
import { TransactionRepository } from '../../domain/repository';

export const OUTBOX_CONSUMER_REPOSITORY_TOKEN = 'OUTBOX_CONSUMER_REPOSITORY_TOKEN';

export interface OutboxConsumerRepository extends TransactionRepository<OutboxConsumerRepository> {
  isProcessed: (entity: DomainEvent, consumerName: string) => Promise<boolean>;
  save: (entity: DomainEvent, consumerName: string) => Promise<void>;
  withTransaction: <T>(fn: (manager: EntityManager) => Promise<T>) => Promise<T>;
}

import { EntityManager } from 'typeorm';
import { TransactionRepository } from '../../domain/repository';
import { IntegrationEvent } from './integration-event';

export const INBOX_CONSUMER_REPOSITORY_TOKEN = 'INBOX_CONSUMER_REPOSITORY_TOKEN';

export interface InboxConsumerRepository extends TransactionRepository<InboxConsumerRepository> {
  isProcessed: (entity: IntegrationEvent, consumerName: string) => Promise<boolean>;
  save: (entity: IntegrationEvent, consumerName: string) => Promise<void>;
  withTransaction: <T>(fn: (manager: EntityManager) => Promise<T>) => Promise<T>;
}

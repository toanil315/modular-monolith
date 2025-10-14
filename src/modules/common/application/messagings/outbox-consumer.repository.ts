import { DomainEvent } from '../../domain/domain-event';

export const OUTBOX_CONSUMER_REPOSITORY_TOKEN = 'OUTBOX_CONSUMER_REPOSITORY_TOKEN';

export interface OutboxConsumerRepository {
  isProcessed: (entity: DomainEvent, consumerName: string) => Promise<boolean>;
  save: (entity: DomainEvent, consumerName: string) => Promise<void>;
}

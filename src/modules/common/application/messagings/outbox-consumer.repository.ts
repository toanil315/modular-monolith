import { DomainEvent } from '../../domain/domain-event';
import { IntegrationEvent } from './integration-event';

export const OUTBOX_CONSUMER_REPOSITORY_TOKEN = 'OUTBOX_CONSUMER_REPOSITORY_TOKEN';

export interface OutboxConsumerRepository {
  isProcessed: (entity: DomainEvent | IntegrationEvent, consumerName: string) => Promise<boolean>;
  save: (entity: DomainEvent | IntegrationEvent, consumerName: string) => Promise<void>;
}

import { IntegrationEvent } from './integration-event';

export const INBOX_CONSUMER_REPOSITORY_TOKEN = 'INBOX_CONSUMER_REPOSITORY_TOKEN';

export interface InboxConsumerRepository {
  isProcessed: (entity: IntegrationEvent, consumerName: string) => Promise<boolean>;
  save: (entity: IntegrationEvent, consumerName: string) => Promise<void>;
}

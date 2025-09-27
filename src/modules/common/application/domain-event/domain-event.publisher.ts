import { Entity } from '../../domain/entity';

export interface DomainEventPublisher {
  publish: (entity: Entity) => Promise<void>;
}

export const DOMAIN_EVENT_PUBLISHER_TOKEN = 'DOMAIN_EVENT_PUBLISHER_TOKEN';

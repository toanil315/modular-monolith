import { Injectable, Provider } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Entity } from '../../domain/entity';
import {
  DOMAIN_EVENT_PUBLISHER_TOKEN,
  DomainEventPublisher,
} from '../../application/domain-event/domain-event.publisher';

@Injectable()
export class DomainEventPublisherImpl implements DomainEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publish(entity: Entity): Promise<void> {
    for (const event of entity.domainEvents) {
      await this.eventBus.publish(event);
    }
    entity.clear();
  }
}

export const DomainEventPublisherProvider: Provider = {
  provide: DOMAIN_EVENT_PUBLISHER_TOKEN,
  useClass: DomainEventPublisherImpl,
};

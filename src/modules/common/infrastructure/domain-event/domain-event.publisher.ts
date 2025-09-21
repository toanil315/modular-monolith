import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Entity } from '../../domain/entity';

@Injectable()
export class DomainEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publish(entity: Entity): Promise<void> {
    for (const event of entity.domainEvents) {
      await this.eventBus.publish(event);
    }
    entity.clear();
  }
}

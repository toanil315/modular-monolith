import { Provider } from '@nestjs/common';
import {
  DOMAIN_EVENT_REGISTRY_TOKEN,
  DomainEventRegistry,
} from 'src/modules/common/infrastructure/outbox/domain-event.registry';
import { DomainEvent } from 'src/modules/common/domain/domain-event';
import { EventDomainEvent } from '../../domain/events/event.domain-event';
import { TicketTypeDomainEvent } from '../../domain/ticket-types/ticket-type.domain-event';
import { CategoryDomainEvent } from '../../domain/categories/category.domain-event';

export const DomainEventRegistryProvider: Provider = {
  provide: DOMAIN_EVENT_REGISTRY_TOKEN,
  useFactory: () => {
    const domainEventRegistry = new DomainEventRegistry();

    registerDomainEvents(
      domainEventRegistry,
      EventDomainEvent as unknown as Record<string, DomainEvent>,
    );

    registerDomainEvents(
      domainEventRegistry,
      TicketTypeDomainEvent as unknown as Record<string, DomainEvent>,
    );

    registerDomainEvents(
      domainEventRegistry,
      CategoryDomainEvent as unknown as Record<string, DomainEvent>,
    );

    return domainEventRegistry;
  },
};

function registerDomainEvents(
  domainEventRegistry: DomainEventRegistry,
  domainEvents: Record<string, DomainEvent>,
) {
  for (const domainEvent of Object.values(domainEvents)) {
    domainEventRegistry.register(domainEvent as never);
  }
}

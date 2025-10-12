import { Provider } from '@nestjs/common';
import {
  DOMAIN_EVENT_REGISTRY_TOKEN,
  DomainEventRegistry,
} from 'src/modules/common/infrastructure/outbox/domain-event.registry';
import { UserDomainEvent } from '../../domain/users/user.domain-event';
import { DomainEvent } from 'src/modules/common/domain/domain-event';

export const DomainEventRegistryProvider: Provider = {
  provide: DOMAIN_EVENT_REGISTRY_TOKEN,
  useFactory: () => {
    const domainEventRegistry = new DomainEventRegistry();

    registerDomainEvents(
      domainEventRegistry,
      UserDomainEvent as unknown as Record<string, DomainEvent>,
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

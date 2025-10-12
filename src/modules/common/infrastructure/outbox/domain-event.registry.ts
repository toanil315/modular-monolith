import { DomainEvent } from '../../domain/domain-event';

export const DOMAIN_EVENT_REGISTRY_TOKEN = 'DOMAIN_EVENT_REGISTRY_TOKEN';

type DomainEventConstructor<T extends DomainEvent = DomainEvent> = new (...args: any[]) => T;

export class DomainEventRegistry {
  private readonly events = new Map<string, DomainEventConstructor>();

  register(ctor: DomainEventConstructor) {
    const name = ctor.name;

    if (this.events.has(name)) {
      throw new Error(`Duplicate domain event registration for: ${name}`);
    }

    this.events.set(name, ctor);
  }

  get(name: string) {
    return this.events.get(name);
  }
}

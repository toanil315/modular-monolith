import { DomainEvent } from '../abstractions/domain-event';

export class EventCreatedDomainEvent extends DomainEvent {
  constructor(public readonly eventId: string) {
    super('DomainEvent.EventCreated');
  }
}

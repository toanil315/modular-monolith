import { DomainEvent } from '../../../common/domain/domain-event';

export namespace EventDomainEvent {
  export class EventCreatedDomainEvent extends DomainEvent {
    constructor(public readonly eventId: string) {
      super('DomainEvent.EventCreated');
    }
  }

  export class EventCanceledDomainEvent extends DomainEvent {
    constructor(public readonly eventId: string) {
      super('DomainEvent.EventCanceled');
    }
  }

  export class EventRescheduledDomainEvent extends DomainEvent {
    constructor(
      public readonly eventId: string,
      public readonly startsAt: number,
      public readonly endsAt: number,
    ) {
      super('DomainEvent.EventScheduled');
    }
  }

  export class EventPublishedDomainEvent extends DomainEvent {
    constructor(public readonly eventId: string) {
      super('DomainEvent.EventScheduled');
    }
  }
}

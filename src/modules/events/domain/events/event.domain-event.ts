import { DomainEvent } from '../../../common/domain/domain-event';

export namespace EventDomainEvent {
  export class EventCreatedDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.EventCreated';

    constructor(public readonly eventId: string) {
      super(EventCreatedDomainEvent.type);
    }
  }

  export class EventCanceledDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.EventCanceled';

    constructor(public readonly eventId: string) {
      super(EventCanceledDomainEvent.type);
    }
  }

  export class EventRescheduledDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.EventRescheduled';

    constructor(
      public readonly eventId: string,
      public readonly startsAt: number,
      public readonly endsAt: number,
    ) {
      super(EventRescheduledDomainEvent.type);
    }
  }

  export class EventPublishedDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.EventPublished';

    constructor(public readonly eventId: string) {
      super(EventPublishedDomainEvent.type);
    }
  }
}

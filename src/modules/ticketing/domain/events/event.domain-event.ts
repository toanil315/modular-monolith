import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace EventDomainEvent {
  export class EventPaymentsRefundedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.EventPaymentsRefunded';

    constructor(public readonly eventId: string) {
      super(EventPaymentsRefundedDomainEvent.type);
    }
  }

  export class EventTicketsArchivedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.EventTicketsArchived';

    constructor(public readonly eventId: string) {
      super(EventTicketsArchivedDomainEvent.type);
    }
  }
}

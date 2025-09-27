import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace EventDomainEvent {
  export class EventPaymentsRefundedDomainEvent extends DomainEvent {
    constructor(public readonly eventId: string) {
      super('DomainEvent.EventPaymentsRefunded');
    }
  }

  export class EventTicketsArchivedDomainEvent extends DomainEvent {
    constructor(public readonly eventId: string) {
      super('DomainEvent.EventTicketsArchived');
    }
  }
}

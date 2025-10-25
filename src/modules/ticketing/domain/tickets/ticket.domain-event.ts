import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace TicketDomainEvent {
  export class TicketCreatedDomainEvent extends DomainEvent {
    static readonly type = 'Ticketing.DomainEvent.TicketCreated';

    constructor(public readonly ticketId: string) {
      super(TicketCreatedDomainEvent.type);
    }
  }

  export class TicketArchivedDomainEvent extends DomainEvent {
    static readonly type = 'Ticketing.DomainEvent.TicketArchived';

    constructor(
      public readonly ticketId: string,
      public readonly code: string,
    ) {
      super(TicketArchivedDomainEvent.type);
    }
  }
}

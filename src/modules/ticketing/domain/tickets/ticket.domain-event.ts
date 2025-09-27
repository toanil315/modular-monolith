import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace TicketDomainEvent {
  export class TicketCreatedDomainEvent extends DomainEvent {
    constructor(public readonly ticketId: string) {
      super('DomainEvent.TicketCreated');
    }
  }

  export class TicketArchivedDomainEvent extends DomainEvent {
    constructor(
      public readonly ticketId: string,
      public readonly code: string,
    ) {
      super('DomainEvent.TicketArchived');
    }
  }
}

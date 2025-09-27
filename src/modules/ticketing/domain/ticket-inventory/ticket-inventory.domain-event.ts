import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace TicketInventoryDomainEvent {
  export class TicketInventoryCreatedDomainEvent extends DomainEvent {
    constructor(public readonly ticketInventoryId: string) {
      super('DomainEvent.TicketInventoryCreated');
    }
  }

  export class TicketInventorySoldOutDomainEvent extends DomainEvent {
    constructor(public readonly ticketInventoryId: string) {
      super('DomainEvent.TicketInventorySoldOut');
    }
  }
}

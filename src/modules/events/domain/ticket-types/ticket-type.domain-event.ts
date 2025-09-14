import { DomainEvent } from '../../../common/domain/domain-event';

export namespace TicketTypeDomainEvent {
  export class TicketTypeCreatedDomainEvent extends DomainEvent {
    constructor(public readonly ticketTypeId: string) {
      super('DomainEvent.TicketTypeCreated');
    }
  }

  export class TicketTypePriceChangedDomainEvent extends DomainEvent {
    constructor(
      public readonly ticketTypeId: string,
      public readonly price: number,
    ) {
      super('DomainEvent.TicketTypePriceChanged');
    }
  }
}

import { DomainEvent } from '../../../common/domain/domain-event';

export namespace TicketTypeDomainEvent {
  export class TicketTypeCreatedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.TicketTypeCreated';

    constructor(public readonly ticketTypeId: string) {
      super(TicketTypeCreatedDomainEvent.type);
    }
  }

  export class TicketTypePriceChangedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.TicketTypePriceChanged';

    constructor(
      public readonly ticketTypeId: string,
      public readonly price: number,
    ) {
      super(TicketTypePriceChangedDomainEvent.type);
    }
  }
}

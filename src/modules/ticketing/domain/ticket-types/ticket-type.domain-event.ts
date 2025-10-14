import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace TicketTypeDomainEvent {
  export class TicketTypeSoldOutDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.TicketTypeSoldOut';

    constructor(public readonly ticketTypeId: string) {
      super(TicketTypeSoldOutDomainEvent.type);
    }
  }
}

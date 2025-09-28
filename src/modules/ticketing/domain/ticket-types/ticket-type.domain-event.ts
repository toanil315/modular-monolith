import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace TicketTypeDomainEvent {
  export class TicketTypeSoldOutDomainEvent extends DomainEvent {
    constructor(public readonly TicketTypeId: string) {
      super('DomainEvent.TicketTypeSoldOut');
    }
  }
}

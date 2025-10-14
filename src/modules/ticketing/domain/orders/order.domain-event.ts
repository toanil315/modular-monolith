import { DomainEvent } from '../../../common/domain/domain-event';

export namespace OrderDomainEvent {
  export class OrderCreatedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.OrderCreated';

    constructor(public readonly orderId: string) {
      super(OrderCreatedDomainEvent.type);
    }
  }

  export class OrderTicketsIssuedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.OrderTicketsIssued';

    constructor(public readonly orderId: string) {
      super(OrderTicketsIssuedDomainEvent.type);
    }
  }
}

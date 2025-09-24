import { DomainEvent } from '../../../common/domain/domain-event';

export namespace OrderDomainEvent {
  export class OrderCreatedDomainEvent extends DomainEvent {
    constructor(public readonly orderId: string) {
      super('DomainEvent.OrderCreated');
    }
  }

  export class OrderTicketsIssuedDomainEvent extends DomainEvent {
    constructor(public readonly orderId: string) {
      super('DomainEvent.OrderTicketsIssued');
    }
  }
}

import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace PaymentDomainEvent {
  export class PaymentCreatedDomainEvent extends DomainEvent {
    constructor(public readonly paymentId: string) {
      super('DomainEvent.PaymentCreated');
    }
  }

  export class PaymentPartiallyRefundedDomainEvent extends DomainEvent {
    constructor(
      public readonly paymentId: string,
      public readonly transactionId: string,
      public readonly refundAmount: number,
    ) {
      super('DomainEvent.PaymentPartiallyRefunded');
    }
  }

  export class PaymentRefundedDomainEvent extends DomainEvent {
    constructor(
      public readonly paymentId: string,
      public readonly transactionId: string,
      public readonly refundAmount: number,
    ) {
      super('DomainEvent.PaymentRefunded');
    }
  }
}

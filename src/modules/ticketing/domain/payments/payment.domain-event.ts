import { DomainEvent } from 'src/modules/common/domain/domain-event';

export namespace PaymentDomainEvent {
  export class PaymentCreatedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.PaymentCreated';

    constructor(public readonly paymentId: string) {
      super(PaymentCreatedDomainEvent.type);
    }
  }

  export class PaymentPartiallyRefundedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.PaymentPartiallyRefunded';

    constructor(
      public readonly paymentId: string,
      public readonly transactionId: string,
      public readonly refundAmount: number,
    ) {
      super(PaymentPartiallyRefundedDomainEvent.type);
    }
  }

  export class PaymentRefundedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.PaymentRefunded';

    constructor(
      public readonly paymentId: string,
      public readonly transactionId: string,
      public readonly refundAmount: number,
    ) {
      super(PaymentRefundedDomainEvent.type);
    }
  }
}

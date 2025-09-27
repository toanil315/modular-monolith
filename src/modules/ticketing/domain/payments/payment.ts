import { Entity } from 'src/modules/common/domain/entity';
import { Result } from 'src/modules/common/domain/result';
import { v4 as uuidV4 } from 'uuid';
import { PaymentDomainEvent } from './payment.domain-event';
import { PaymentError } from './payment.error';
import { Order } from '../orders/order';

export class Payment extends Entity {
  constructor(
    public id: string,
    public orderId: string,
    public transactionId: string,
    public amount: number,
    public currency: string,
    public amountRefunded: number | null,
    public createdAtUtc: Date,
    public refundedAtUtc: Date | null,
  ) {
    super();
  }

  static create(order: Order, transactionId: string, amount: number, currency: string) {
    const payment = new Payment(
      uuidV4(),
      order.id,
      transactionId,
      amount,
      currency,
      null,
      new Date(),
      null,
    );

    payment.raise(new PaymentDomainEvent.PaymentCreatedDomainEvent(payment.id));

    return Result.success(payment);
  }

  refund(refundAmount: number): Result<Payment> {
    if (this.amountRefunded !== null && this.amountRefunded === this.amount) {
      return Result.failure(PaymentError.AlreadyRefunded);
    }

    if ((this.amountRefunded ?? 0) + refundAmount > this.amount) {
      return Result.failure(PaymentError.NotEnoughFunds);
    }

    this.amountRefunded = (this.amountRefunded ?? 0) + refundAmount;

    if (this.amount === this.amountRefunded) {
      this.raise(
        new PaymentDomainEvent.PaymentRefundedDomainEvent(
          this.id,
          this.transactionId,
          refundAmount,
        ),
      );
    } else {
      this.raise(
        new PaymentDomainEvent.PaymentPartiallyRefundedDomainEvent(
          this.id,
          this.transactionId,
          refundAmount,
        ),
      );
    }

    return Result.success(this);
  }
}

import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Payment } from 'src/modules/ticketing/domain/payments/payment';

export class RefundCommand extends Command<Result<Payment>> {
  constructor(
    public readonly props: {
      paymentId: string;
      amount: number;
    },
  ) {
    super();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefundCommand } from './refund-command';
import {
  PAYMENT_REPOSITORY_TOKEN,
  PaymentRepository,
} from 'src/modules/ticketing/domain/payments/payment.repository';
import { Payment } from 'src/modules/ticketing/domain/payments/payment';
import { Result } from 'src/modules/common/domain/result';
import { PaymentError } from 'src/modules/ticketing/domain/payments/payment.error';

@Injectable()
@CommandHandler(RefundCommand)
export class RefundCommandHandler implements ICommandHandler<RefundCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN) private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute({ props }: RefundCommand): Promise<Result<Payment>> {
    const payment = await this.paymentRepository.getById(props.paymentId);

    if (!payment) {
      return Result.failure(PaymentError.NotFound(props.paymentId));
    }

    const result = payment.refund(props.amount);

    if (!result.isSuccess) {
      return result;
    }

    await this.paymentRepository.save(result.value);
    return result;
  }
}

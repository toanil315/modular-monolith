import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Order } from 'src/modules/ticketing/domain/orders/order';

export class CreateOrderCommand extends Command<Result<Order>> {
  constructor(
    public readonly props: {
      customerId: string;
    },
  ) {
    super();
  }
}

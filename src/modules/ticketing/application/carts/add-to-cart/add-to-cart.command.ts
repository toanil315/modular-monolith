import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Cart } from 'src/modules/ticketing/domain/carts/cart';

export class AddToCartCommand extends Command<Result<Cart>> {
  constructor(
    public readonly props: {
      customerId: string;
      ticketTypeId: string;
      quantity: number;
    },
  ) {
    super();
  }
}

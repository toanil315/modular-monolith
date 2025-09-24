import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Cart } from 'src/modules/ticketing/domain/carts/cart';

export class GetCartQuery extends Query<Result<Cart>> {
  constructor(
    public readonly props: {
      customerId: string;
    },
  ) {
    super();
  }
}

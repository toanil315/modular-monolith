import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from './get-cart.query';
import { CartService } from '../cart.service';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from 'src/modules/ticketing/domain/customers/customer.repository';
import { Result } from 'src/modules/common/domain/result';
import { CustomerErrors } from 'src/modules/ticketing/domain/customers/customer.error';

@QueryHandler(GetCartQuery)
export class GetCartQueryHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    private readonly cartService: CartService,
    @Inject(CUSTOMER_REPOSITORY_TOKEN) private readonly customerRepository: CustomerRepository,
  ) {}

  async execute({ props }: GetCartQuery) {
    const customer = await this.customerRepository.getById(props.customerId);

    if (!customer) {
      return Result.failure(CustomerErrors.CustomerNotFoundError(props.customerId));
    }

    const cart = await this.cartService.get(props.customerId);
    return Result.success(cart);
  }
}

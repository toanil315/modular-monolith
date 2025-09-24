import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClearCartCommand } from './clear-cart.command';
import { CartService } from '../cart.service';
import { Result } from 'src/modules/common/domain/result';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from 'src/modules/ticketing/domain/customers/customer.repository';
import { CustomerErrors } from 'src/modules/ticketing/domain/customers/customer.error';

@CommandHandler(ClearCartCommand)
export class ClearCartCommandHandler implements ICommandHandler<ClearCartCommand> {
  constructor(
    private readonly cartService: CartService,
    @Inject(CUSTOMER_REPOSITORY_TOKEN) private readonly customerRepository: CustomerRepository,
  ) {}

  async execute({ props }: ClearCartCommand) {
    const customer = await this.customerRepository.getById(props.customerId);

    if (!customer) {
      return Result.failure(CustomerErrors.CustomerNotFoundError(props.customerId));
    }

    await this.cartService.clear(props.customerId);
    return Result.success(null);
  }
}

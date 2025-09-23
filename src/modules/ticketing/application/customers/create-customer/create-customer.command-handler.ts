import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateCustomerCommand } from './create-customer.command';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from 'src/modules/ticketing/domain/customers/customer.repository';
import { Customer } from 'src/modules/ticketing/domain/customers/customer';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute({ props }: CreateCustomerCommand) {
    const result = Customer.create(props.id, props.firstName, props.lastName, props.email);
    await this.customerRepository.save(result.value);
    return result;
  }
}

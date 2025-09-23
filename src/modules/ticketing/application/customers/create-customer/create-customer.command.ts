import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Customer } from 'src/modules/ticketing/domain/customers/customer';

export class CreateCustomerCommand extends Command<Result<Customer>> {
  constructor(
    public readonly props: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
    },
  ) {
    super();
  }
}

import { Injectable } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UsersIntegrationEvent } from 'src/modules/users/integration/events/users.integration-event';
import { CreateCustomerCommand } from '../../application/customers/create-customer/create-customer.command';

@EventsHandler(UsersIntegrationEvent.UserRegisteredIntegrationEvent)
@Injectable()
export class UserRegisteredIntegrationEventHandler
  implements IEventHandler<UsersIntegrationEvent.UserRegisteredIntegrationEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: UsersIntegrationEvent.UserRegisteredIntegrationEvent) {
    const result = await this.commandBus.execute(
      new CreateCustomerCommand({
        id: event.userId,
        firstName: event.firstName,
        lastName: event.lastName,
        email: event.email,
      }),
    );

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }
  }
}

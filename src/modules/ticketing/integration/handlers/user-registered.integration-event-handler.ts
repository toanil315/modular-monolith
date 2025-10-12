import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../../application/customers/create-customer/create-customer.command';
import { UsersIntegrationEvent } from 'src/modules/users/public/events';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';

@Injectable()
export class UserRegisteredIntegrationEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @EventHandler(UsersIntegrationEvent.UserRegisteredIntegrationEvent)
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

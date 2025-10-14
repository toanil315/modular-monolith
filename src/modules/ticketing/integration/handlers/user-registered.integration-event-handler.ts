import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../../application/customers/create-customer/create-customer.command';
import { UsersIntegrationEvent } from 'src/modules/users/public/events';
import { BaseIntegrationEventHandler } from 'src/modules/common/application/event-bus/integration-event-handler.base';
import {
  INBOX_CONSUMER_REPOSITORY_TOKEN,
  InboxConsumerRepository,
} from 'src/modules/common/application/messagings/inbox-consumer.repository';
import { IntegrationEventHandler } from 'src/modules/common/application/event-bus/integration-event-handler.decorator';

@Injectable()
export class UserRegisteredIntegrationEventHandler extends BaseIntegrationEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(INBOX_CONSUMER_REPOSITORY_TOKEN)
    inboxConsumerRepository: InboxConsumerRepository,
  ) {
    super(inboxConsumerRepository, 'ticketing.integration.handlers');
  }

  @IntegrationEventHandler(UsersIntegrationEvent.UserRegisteredIntegrationEvent)
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

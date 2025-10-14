import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TicketTypeIntegrationEvent } from 'src/modules/events/public/events';
import { CreateTicketTypeCommand } from '../../application/ticket-types/create-ticket-type.command';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import { BaseIntegrationEventHandler } from 'src/modules/common/application/event-bus/integration-event-handler.base';
import { IntegrationEventHandler } from 'src/modules/common/application/event-bus/integration-event-handler.decorator';
import {
  INBOX_CONSUMER_REPOSITORY_TOKEN,
  InboxConsumerRepository,
} from 'src/modules/common/application/messagings/inbox-consumer.repository';

@Injectable()
export class TicketTypeCreatedIntegrationEventHandler extends BaseIntegrationEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(INBOX_CONSUMER_REPOSITORY_TOKEN)
    inboxConsumerRepository: InboxConsumerRepository,
  ) {
    super(inboxConsumerRepository, 'ticketing.integration.handlers');
  }

  @IntegrationEventHandler(TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent)
  async handle(event: TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent) {
    const result = await this.commandBus.execute(
      new CreateTicketTypeCommand({
        id: event.ticketTypeId,
        currency: event.currency,
        eventId: event.eventId,
        name: event.name,
        price: event.price,
        quantity: event.quantity,
      }),
    );

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TicketTypeIntegrationEvent } from 'src/modules/events/public/events';
import { CreateTicketTypeCommand } from '../../application/ticket-types/create-ticket-type.command';

@EventsHandler(TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent)
@Injectable()
export class TicketTypeCreatedIntegrationEventHandler
  implements IEventHandler<TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

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

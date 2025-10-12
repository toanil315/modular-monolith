import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TicketTypeIntegrationEvent } from 'src/modules/events/public/events';
import { CreateTicketTypeCommand } from '../../application/ticket-types/create-ticket-type.command';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';

@Injectable()
export class TicketTypeCreatedIntegrationEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @EventHandler(TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent)
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

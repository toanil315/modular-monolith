import { Injectable, Provider } from '@nestjs/common';
import {
  EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  EventsIntegrationEventsPublisher,
} from '../../application/abstractions/integration-event.publisher';
import { EventBus } from '@nestjs/cqrs';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeIntegrationEvent } from '../events/ticket-types.integration-event';

@Injectable()
export class EventsIntegrationEventsPublisherImpl implements EventsIntegrationEventsPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publishTicketTypeCreated(ticketType: TicketType) {
    await this.eventBus.publish(
      new TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent(
        ticketType.id,
        ticketType.eventId,
        ticketType.name,
        ticketType.price,
        ticketType.currency,
        ticketType.quantity,
      ),
    );
  }
}

export const EventsIntegrationEventPublisherProvider: Provider = {
  provide: EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  useClass: EventsIntegrationEventsPublisherImpl,
};

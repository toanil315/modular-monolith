import { Inject, Injectable, Provider } from '@nestjs/common';
import {
  EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  EventsIntegrationEventsPublisher,
} from '../../application/abstractions/integration-event.publisher';
import { TicketType } from '../../domain/ticket-types/ticket-type';
import { TicketTypeIntegrationEvent } from '../events/ticket-types.integration-event';
import {
  EVENT_BUS_ADAPTER_TOKEN,
  EventBusAdapter,
} from 'src/modules/common/application/event-bus/event-bus.adapter';

@Injectable()
export class EventsIntegrationEventsPublisherImpl implements EventsIntegrationEventsPublisher {
  constructor(@Inject(EVENT_BUS_ADAPTER_TOKEN) private readonly eventBus: EventBusAdapter) {}

  async publishTicketTypeCreated(ticketType: TicketType) {
    await this.eventBus.publish([
      new TicketTypeIntegrationEvent.TicketTypeCreatedIntegrationEvent(
        ticketType.id,
        ticketType.eventId,
        ticketType.name,
        ticketType.price,
        ticketType.currency,
        ticketType.quantity,
      ),
    ]);
  }
}

export const EventsIntegrationEventPublisherProvider: Provider = {
  provide: EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  useClass: EventsIntegrationEventsPublisherImpl,
};

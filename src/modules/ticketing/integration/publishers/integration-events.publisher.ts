import {
  EVENT_BUS_ADAPTER_TOKEN,
  EventBusAdapter,
} from 'src/modules/common/application/event-bus/event-bus.adapter';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../application/abstractions/integration-event.pulisher';
import { Inject, Provider } from '@nestjs/common';
import { Ticket } from '../../domain/tickets/ticket';
import { TicketIntegrationEvent } from '../events/ticket.integration-event';

export class IntegrationEventsPublisherImpl implements IntegrationEventsPublisher {
  constructor(@Inject(EVENT_BUS_ADAPTER_TOKEN) private readonly eventBus: EventBusAdapter) {}

  async publishTicketCreated(ticket: Ticket) {
    await this.eventBus.publish([
      new TicketIntegrationEvent.TicketCreatedIntegrationEvent(
        ticket.id,
        ticket.customerId,
        ticket.orderId,
        ticket.eventId,
        ticket.ticketTypeId,
        ticket.code,
        ticket.createdAt,
        ticket.archived,
      ),
    ]);
  }
}

export const IntegrationEventsPublisherProvider: Provider = {
  provide: INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  useClass: IntegrationEventsPublisherImpl,
};

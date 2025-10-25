import { Event } from '../../domain/events/event';
import { TicketType } from '../../domain/ticket-types/ticket-type';

export const EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN =
  'EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN';

export interface EventsIntegrationEventsPublisher {
  publishTicketTypeCreated: (ticketType: TicketType) => Promise<void>;
  publishEventPublished: (event: Event) => Promise<void>;
}

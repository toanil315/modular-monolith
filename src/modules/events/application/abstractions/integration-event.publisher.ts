import { TicketType } from '../../domain/ticket-types/ticket-type';

export const INTEGRATION_EVENTS_PUBLISHER_TOKEN = 'INTEGRATION_EVENTS_PUBLISHER_TOKEN';

export interface IntegrationEventsPublisher {
  publishTicketTypeCreated: (ticketType: TicketType) => Promise<void>;
}

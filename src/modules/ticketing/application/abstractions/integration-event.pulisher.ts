import { Ticket } from '../../domain/tickets/ticket';

export const INTEGRATION_EVENTS_PUBLISHER_TOKEN = 'INTEGRATION_EVENTS_PUBLISHER_TOKEN';

export interface IntegrationEventsPublisher {
  publishTicketCreated: (ticket: Ticket) => Promise<void>;
}

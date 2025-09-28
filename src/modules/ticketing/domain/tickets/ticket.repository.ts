import { Ticket } from './ticket';

export interface TicketRepository {
  getByIdOrCode: (identifier: string) => Promise<Ticket | null>;
  getForEvent: (eventId: string) => Promise<Ticket | null>;
  save: (ticket: Ticket | Ticket[]) => Promise<void>;
}

export const TICKET_REPOSITORY_TOKEN = 'TICKET_REPOSITORY_TOKEN';

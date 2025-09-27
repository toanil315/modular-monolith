import { Ticket } from './ticket';

export interface TicketRepository {
  getById: (ticketId: string) => Promise<Ticket | null>;
  getByCode: (ticketCode: string) => Promise<Ticket | null>;
  save: (ticket: Ticket) => Promise<void>;
}

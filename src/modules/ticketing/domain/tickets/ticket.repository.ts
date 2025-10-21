import { TransactionRepository } from 'src/modules/common/domain/repository';
import { Ticket } from './ticket';

export interface TicketRepository extends TransactionRepository<TicketRepository> {
  getByIdOrCode: (identifier: string) => Promise<Ticket | null>;
  getForEvent: (eventId: string) => Promise<Ticket | null>;
  save: (ticket: Ticket) => Promise<void>;
  saveBatch: (tickets: Ticket[]) => Promise<void>;
}

export const TICKET_REPOSITORY_TOKEN = 'TICKET_REPOSITORY_TOKEN';

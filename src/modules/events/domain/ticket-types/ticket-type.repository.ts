import { TicketType } from './ticket-type';

export interface TicketTypeRepository {
  insert: (ticketType: TicketType) => Promise<void>;
  getById: (ticketTypeId: string) => Promise<TicketType | null>;
  save: (ticketType: TicketType) => Promise<void>;
}

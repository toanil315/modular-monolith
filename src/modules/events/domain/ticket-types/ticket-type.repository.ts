import { TicketType } from './ticket-type';

export interface TicketTypeRepository {
  getById: (ticketTypeId: string) => Promise<TicketType | null>;
  save: (ticketType: TicketType) => Promise<void>;
}

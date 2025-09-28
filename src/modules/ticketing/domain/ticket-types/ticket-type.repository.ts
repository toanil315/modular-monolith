import { TicketType } from './ticket-type';

export interface TicketTypeRepository {
  getById: (TicketTypeId: string) => Promise<TicketType | null>;
  save: (TicketType: TicketType) => Promise<void>;
}

export const TICKET_INVENTORY_REPOSITORY_TOKEN = 'TICKET_INVENTORY_REPOSITORY_TOKEN';

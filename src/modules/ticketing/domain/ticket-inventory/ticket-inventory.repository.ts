import { TicketInventory } from './ticket-inventory';

export interface TicketInventoryRepository {
  getById: (ticketInventoryId: string) => Promise<TicketInventory | null>;
  save: (ticketInventory: TicketInventory) => Promise<void>;
}

export const TICKET_INVENTORY_REPOSITORY_TOKEN = 'TICKET_INVENTORY_REPOSITORY_TOKEN';

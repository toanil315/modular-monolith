import { TicketInventory } from './ticket-inventory';

export interface TicketInventoryRepository {
  getById: (ticketInventoryId: string) => Promise<TicketInventory | null>;
  save: (ticketInventory: TicketInventory) => Promise<void>;
}

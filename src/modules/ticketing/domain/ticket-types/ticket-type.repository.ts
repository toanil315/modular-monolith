import { TicketType } from './ticket-type';
import { TransactionRepository } from 'src/modules/common/domain/repository';

export interface TicketTypeRepository extends TransactionRepository<TicketTypeRepository> {
  getById: (ticketTypeId: string) => Promise<TicketType | null>;
  getWithLock: (ticketTypeId: string) => Promise<TicketType | null>;
  save: (ticketType: TicketType) => Promise<void>;
}

export const TICKET_TYPE_REPOSITORY_TOKEN = 'TICKET_TYPE_REPOSITORY_TOKEN';

import { TransactionRepository } from 'src/modules/common/domain/repository';
import { Payment } from './payment';

export interface PaymentRepository extends TransactionRepository<PaymentRepository> {
  getById: (paymentId: string) => Promise<Payment | null>;
  getForEvent: (eventId: string) => Promise<Payment[]>;
  save: (payment: Payment) => Promise<void>;
}

export const PAYMENT_REPOSITORY_TOKEN = 'PAYMENT_REPOSITORY_TOKEN';

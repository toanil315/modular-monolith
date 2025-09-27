import { Payment } from './payment';

export interface PaymentRepository {
  getById: (paymentId: string) => Promise<Payment | null>;
  getForEvent: (eventId: string) => Promise<Payment[]>;
  save: (payment: Payment) => Promise<void>;
}

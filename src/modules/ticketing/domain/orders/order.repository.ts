import { Order } from './order';

export interface OrderRepository {
  getById: (orderId: string) => Promise<Order | null>;
  save: (order: Order) => Promise<void>;
}

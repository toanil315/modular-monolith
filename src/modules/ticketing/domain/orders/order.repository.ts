import { Order } from './order';

export interface OrderRepository {
  getById: (orderId: string) => Promise<Order | null>;
  save: (order: Order) => Promise<void>;
}

export const ORDER_REPOSITORY_TOKEN = 'ORDER_REPOSITORY_TOKEN';

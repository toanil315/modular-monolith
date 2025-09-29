import { Order } from './order';
import { TransactionRepository } from 'src/modules/common/domain/repository';

export interface OrderRepository extends TransactionRepository<OrderRepository> {
  getById: (orderId: string) => Promise<Order | null>;
  save: (order: Order) => Promise<void>;
}

export const ORDER_REPOSITORY_TOKEN = 'ORDER_REPOSITORY_TOKEN';

import { EntityManager } from 'typeorm';

export interface TransactionRepository<T> {
  withManager(manager: EntityManager): T;
}

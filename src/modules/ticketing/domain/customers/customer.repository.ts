import { Customer } from './customer';

export const CUSTOMER_REPOSITORY_TOKEN = 'CUSTOMER_REPOSITORY_TOKEN';

export interface CustomerRepository {
  getById: (userId: string) => Promise<Customer | null>;
  save: (user: Customer) => Promise<void>;
}

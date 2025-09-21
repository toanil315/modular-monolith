import { User } from './user';

export interface UserRepository {
  getById: (userId: string) => Promise<User | null>;
  save: (user: User) => Promise<void>;
}

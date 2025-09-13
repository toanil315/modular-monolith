import { Category } from './category';

export interface CategoryRepository {
  insert: (category: Category) => Promise<void>;
  getById: (categoryId: string) => Promise<Category | null>;
  save: (category: Category) => Promise<void>;
}

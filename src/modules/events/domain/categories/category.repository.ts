import { Category } from './category';

export interface CategoryRepository {
  getById: (categoryId: string) => Promise<Category | null>;
  save: (category: Category) => Promise<void>;
}

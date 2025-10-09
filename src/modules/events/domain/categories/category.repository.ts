import { Category } from './category';

export const CATEGORY_REPOSITORY_TOKEN = 'CATEGORY_REPOSITORY_TOKEN';

export interface CategoryRepository {
  getById: (categoryId: string) => Promise<Category | null>;
  save: (category: Category) => Promise<void>;
}

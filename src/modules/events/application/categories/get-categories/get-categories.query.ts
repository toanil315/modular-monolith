import { Query } from '@nestjs/cqrs';
import { Category } from 'src/modules/events/domain/categories/category';

export class GetCategoriesQuery extends Query<Category[]> {
  constructor() {
    super();
  }
}

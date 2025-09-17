import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Category } from 'src/modules/events/domain/categories/category';

export class GetCategoriesQuery extends Query<Result<Category[]>> {
  constructor() {
    super();
  }
}

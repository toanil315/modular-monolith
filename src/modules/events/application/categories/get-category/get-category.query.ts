import { Query } from '@nestjs/cqrs';
import { Category } from 'src/modules/events/domain/categories/category';

export class GetCategoryQuery extends Query<Category> {
  constructor(
    public readonly props: {
      categoryId: string;
    },
  ) {
    super();
  }
}

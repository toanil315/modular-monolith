import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Category } from 'src/modules/events/domain/categories/category';

export class GetCategoryQuery extends Query<Result<Category>> {
  constructor(
    public readonly props: {
      categoryId: string;
    },
  ) {
    super();
  }
}

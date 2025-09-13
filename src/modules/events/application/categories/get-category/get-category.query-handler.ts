import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryExceptions } from 'src/modules/events/domain/categories/category.exception';

@QueryHandler(GetCategoryQuery)
export class GetCategoryQueryHandler
  implements IQueryHandler<GetCategoryQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: GetCategoryQuery) {
    const category = await this.categoryRepository.getById(props.categoryId);

    if (!category) {
      throw new CategoryExceptions.CategoryNotFoundException(props.categoryId);
    }

    return category;
  }
}

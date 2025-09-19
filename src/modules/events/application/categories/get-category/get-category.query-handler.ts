import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryErrors } from 'src/modules/events/domain/categories/category.exception';
import { Result } from 'src/modules/common/domain/result';
import {
  CACHING_SERVICE_TOKEN,
  CachingService,
} from 'src/modules/common/application/caching/caching.service';
import { CategoryCachingKey } from '../caching/caching.key';
import { Category } from 'src/modules/events/domain/categories/category';

@QueryHandler(GetCategoryQuery)
export class GetCategoryQueryHandler
  implements IQueryHandler<GetCategoryQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
    @Inject(CACHING_SERVICE_TOKEN) private cachingService: CachingService,
  ) {}

  async execute({ props }: GetCategoryQuery) {
    const cachedCategory = await this.cachingService.get<Category>(
      CategoryCachingKey.CATEGORY(props.categoryId),
    );

    if (cachedCategory) {
      return Result.success<Category>(cachedCategory);
    }

    const category = await this.categoryRepository.getById(props.categoryId);

    if (!category) {
      return Result.failure(
        CategoryErrors.CategoryNotFoundError(props.categoryId),
      );
    }

    this.cachingService.set(
      CategoryCachingKey.CATEGORY(props.categoryId),
      category,
    );

    return Result.success(category);
  }
}

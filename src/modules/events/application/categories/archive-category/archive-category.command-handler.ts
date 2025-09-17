import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveCategoryCommand } from './archive-category.command';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryErrors } from 'src/modules/events/domain/categories/category.exception';
import { Result } from 'src/modules/common/domain/result';

@CommandHandler(ArchiveCategoryCommand)
export class ArchiveCategoryCommandHandler
  implements ICommandHandler<ArchiveCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: ArchiveCategoryCommand) {
    const category = await this.categoryRepository.getById(props.id);

    if (!category) {
      return Result.failure(CategoryErrors.CategoryNotFoundError(props.id));
    }

    const result = category.archive();
    await this.categoryRepository.save(result.value);

    return result;
  }
}

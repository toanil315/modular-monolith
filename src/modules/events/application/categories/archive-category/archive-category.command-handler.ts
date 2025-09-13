import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveCategoryCommand } from './archive-category.command';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryExceptions } from 'src/modules/events/domain/categories/category.exception';

@CommandHandler(ArchiveCategoryCommand)
export class ArchiveCategoryCommandHandler
  implements ICommandHandler<ArchiveCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: ArchiveCategoryCommand): Promise<void> {
    const category = await this.categoryRepository.getById(props.id);

    if (!category) {
      throw new CategoryExceptions.CategoryNotFoundException(props.id);
    }

    category.archive();
    await this.categoryRepository.save(category);
  }
}

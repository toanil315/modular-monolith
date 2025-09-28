import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryErrors } from 'src/modules/events/domain/categories/category.error';
import { Result } from 'src/modules/common/domain/result';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: UpdateCategoryCommand) {
    const category = await this.categoryRepository.getById(props.id);

    if (!category) {
      return Result.failure(CategoryErrors.CategoryNotFoundError(props.id));
    }

    const result = category.changeName(props.name);
    await this.categoryRepository.save(result.value);

    return result;
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryExceptions } from 'src/modules/events/domain/categories/category.exception';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: UpdateCategoryCommand): Promise<void> {
    const category = await this.categoryRepository.getById(props.id);

    console.log(category);

    if (!category) {
      throw new CategoryExceptions.CategoryNotFoundException(props.id);
    }

    category.changeName(props.name);
    await this.categoryRepository.save(category);
  }
}

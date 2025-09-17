import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { Category } from 'src/modules/events/domain/categories/category';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({ props }: CreateCategoryCommand) {
    const result = Category.create(props.name);
    await this.categoryRepository.insert(result.value);
    return result;
  }
}

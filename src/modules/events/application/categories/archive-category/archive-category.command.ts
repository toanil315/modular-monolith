import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Category } from 'src/modules/events/domain/categories/category';

export class ArchiveCategoryCommand extends Command<Result<Category>> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

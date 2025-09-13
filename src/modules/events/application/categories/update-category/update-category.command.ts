import { Command } from '@nestjs/cqrs';

export class UpdateCategoryCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
      name: string;
    },
  ) {
    super();
  }
}

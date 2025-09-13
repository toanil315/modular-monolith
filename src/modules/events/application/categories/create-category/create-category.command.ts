import { Command } from '@nestjs/cqrs';

export class CreateCategoryCommand extends Command<{
  id: string;
}> {
  constructor(
    public readonly props: {
      name: string;
    },
  ) {
    super();
  }
}

import { Command } from '@nestjs/cqrs';

export class ArchiveCategoryCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

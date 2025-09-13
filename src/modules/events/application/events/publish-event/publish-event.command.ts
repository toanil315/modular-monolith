import { Command } from '@nestjs/cqrs';

export class PublishEventCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

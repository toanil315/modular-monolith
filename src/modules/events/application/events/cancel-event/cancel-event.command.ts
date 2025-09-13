import { Command } from '@nestjs/cqrs';

export class CancelEventCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

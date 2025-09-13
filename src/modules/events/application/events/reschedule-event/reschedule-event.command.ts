import { Command } from '@nestjs/cqrs';

export class RescheduleEventCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
      startsAt: number;
      endsAt: number;
    },
  ) {
    super();
  }
}

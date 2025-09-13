import { Command } from '@nestjs/cqrs';

export class CreateEventCommand extends Command<{
  id: string;
}> {
  constructor(
    public readonly props: {
      categoryId: string;
      title: string;
      description: string;
      location: string;
      startsAt: number;
      endsAt: number;
    },
  ) {
    super();
  }
}

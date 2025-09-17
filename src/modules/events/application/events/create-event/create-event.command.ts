import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Event } from 'src/modules/events/domain/events/event';

export class CreateEventCommand extends Command<Result<Event>> {
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

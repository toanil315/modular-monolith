import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Event } from 'src/modules/events/domain/events/event';

export class RescheduleEventCommand extends Command<Result<Event>> {
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

import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Event } from 'src/modules/events/domain/events/event';

export class CancelEventCommand extends Command<Result<Event>> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Event } from 'src/modules/events/domain/events/event';

export class GetEventQuery extends Query<Result<Event>> {
  constructor(
    public readonly props: {
      eventId: string;
    },
  ) {
    super();
  }
}

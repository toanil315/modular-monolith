import { Query } from '@nestjs/cqrs';
import { Event } from 'src/modules/events/domain/events/event';

export class GetEventQuery extends Query<Event> {
  constructor(
    public readonly props: {
      eventId: string;
    },
  ) {
    super();
  }
}

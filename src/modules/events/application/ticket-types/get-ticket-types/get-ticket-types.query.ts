import { Query } from '@nestjs/cqrs';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class GetTicketTypesQuery extends Query<TicketType[]> {
  constructor(
    public readonly props: {
      eventId: string;
    },
  ) {
    super();
  }
}

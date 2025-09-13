import { Query } from '@nestjs/cqrs';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class GetTicketTypeQuery extends Query<TicketType> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

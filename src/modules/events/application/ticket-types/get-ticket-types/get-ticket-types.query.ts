import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class GetTicketTypesQuery extends Query<Result<TicketType[]>> {
  constructor(
    public readonly props: {
      eventId: string;
    },
  ) {
    super();
  }
}

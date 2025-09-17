import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class GetTicketTypeQuery extends Query<Result<TicketType>> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { Ticket } from 'src/modules/ticketing/domain/tickets/ticket';

export class CreateTicketBatchCommand extends Command<Result<Ticket[]>> {
  constructor(
    public readonly props: {
      orderId: string;
    },
  ) {
    super();
  }
}

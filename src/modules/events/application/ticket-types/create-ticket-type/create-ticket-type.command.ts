import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class CreateTicketTypeCommand extends Command<Result<TicketType>> {
  constructor(
    public readonly props: {
      eventId: string;
      name: string;
      price: number;
      currency: string;
      quantity: number;
    },
  ) {
    super();
  }
}

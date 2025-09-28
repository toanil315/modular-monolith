import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from '../../domain/ticket-types/ticket-type';

export class CreateTicketTypeCommand extends Command<Result<TicketType>> {
  constructor(
    public readonly props: {
      id: string;
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

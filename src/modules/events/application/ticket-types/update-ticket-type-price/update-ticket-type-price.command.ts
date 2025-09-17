import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

export class UpdateTicketTypePriceCommand extends Command<Result<TicketType>> {
  constructor(
    public readonly props: {
      id: string;
      price: number;
    },
  ) {
    super();
  }
}

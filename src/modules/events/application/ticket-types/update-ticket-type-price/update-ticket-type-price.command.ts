import { Command } from '@nestjs/cqrs';

export class UpdateTicketTypePriceCommand extends Command<void> {
  constructor(
    public readonly props: {
      id: string;
      price: number;
    },
  ) {
    super();
  }
}

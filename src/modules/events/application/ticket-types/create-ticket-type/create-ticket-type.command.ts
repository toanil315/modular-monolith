import { Command } from '@nestjs/cqrs';

export class CreateTicketTypeCommand extends Command<{
  id: string;
}> {
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

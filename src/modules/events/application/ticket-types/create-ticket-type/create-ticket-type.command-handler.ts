import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTicketTypeCommand } from './create-ticket-type.command';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventExceptions } from 'src/modules/events/domain/events/event.exception';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';

@CommandHandler(CreateTicketTypeCommand)
export class CreateTicketTypeCommandHandler
  implements ICommandHandler<CreateTicketTypeCommand>
{
  constructor(
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private ticketTypeRepository: TicketTypeRepository,

    @Inject(EVENT_REPOSITORY_TOKEN)
    private eventRepository: EventRepository,
  ) {}

  async execute({ props }: CreateTicketTypeCommand) {
    const event = await this.eventRepository.getById(props.eventId);

    if (!event) {
      throw new EventExceptions.EventNotFoundException(props.eventId);
    }

    const ticketType = TicketType.create(
      event,
      props.name,
      props.price,
      props.currency,
      props.quantity,
    );
    await this.ticketTypeRepository.insert(ticketType);

    return { id: ticketType.id };
  }
}

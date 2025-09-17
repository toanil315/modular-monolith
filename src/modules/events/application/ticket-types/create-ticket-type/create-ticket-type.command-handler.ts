import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTicketTypeCommand } from './create-ticket-type.command';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventErrors } from 'src/modules/events/domain/events/event.exception';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';
import { Result } from 'src/modules/common/domain/result';

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
      return Result.failure(EventErrors.EventNotFoundError(props.eventId));
    }

    const result = TicketType.create(
      event,
      props.name,
      props.price,
      props.currency,
      props.quantity,
    );

    await this.ticketTypeRepository.insert(result.value);
    return result;
  }
}

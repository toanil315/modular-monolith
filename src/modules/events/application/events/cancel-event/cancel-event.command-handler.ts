import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { CancelEventCommand } from './cancel-event.command';
import { EventExceptions } from 'src/modules/events/domain/events/event.exception';

@CommandHandler(CancelEventCommand)
export class CreateEventCommandHandler
  implements ICommandHandler<CancelEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: CancelEventCommand) {
    const event = await this.eventRepository.getById(props.id);

    if (!event) {
      throw new EventExceptions.EventNotFoundException(props.id);
    }

    event.cancel();
  }
}

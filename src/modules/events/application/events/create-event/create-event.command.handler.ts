import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { CreateEventCommand } from './create-event.command';
import { Event } from 'src/modules/events/domain/events/event';

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler
  implements ICommandHandler<CreateEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: CreateEventCommand) {
    const newEvent = Event.create(
      props.title,
      props.description,
      props.location,
      props.startsAt,
      props.endsAt,
    );
    await this.eventRepository.insert(newEvent);
    return { id: newEvent.id };
  }
}

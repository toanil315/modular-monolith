import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { CreateEventCommand } from './create-event.command';
import { Event } from 'src/modules/events/domain/events/event';
import { CATEGORY_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/categories/category.repository.impl';
import { CategoryRepository } from 'src/modules/events/domain/categories/category.repository';
import { CategoryExceptions } from 'src/modules/events/domain/categories/category.exception';
import { EventExceptions } from 'src/modules/events/domain/events/event.exception';

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler
  implements ICommandHandler<CreateEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryToken: CategoryRepository,
  ) {}

  async execute({ props }: CreateEventCommand) {
    if (props.startsAt < Date.now()) {
      throw new EventExceptions.EventStartDateInPastException();
    }

    const category = await this.categoryToken.getById(props.categoryId);

    if (!category) {
      throw new CategoryExceptions.CategoryNotFoundException(props.categoryId);
    }

    const newEvent = Event.create(
      category,
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

import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { GetEventQuery } from './get-event.query';
import { EventExceptions } from 'src/modules/events/domain/events/event.exception';

@QueryHandler(GetEventQuery)
export class GetEventQueryHandler implements IQueryHandler<GetEventQuery> {
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: GetEventQuery) {
    const event = await this.eventRepository.getById(props.eventId);

    if (!event) {
      throw new EventExceptions.EventNotFoundException(props.eventId);
    }

    return event;
  }
}

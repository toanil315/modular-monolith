import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { GetEventQuery } from './get-event.query';
import { EventNotFoundException } from './get-event.exception';
import { ResponseFormatter } from 'src/modules/common/formatters/response.formatter';
import { Event } from 'src/modules/events/domain/events/event';

@QueryHandler(GetEventQuery)
export class GetEventQueryHandler implements IQueryHandler<GetEventQuery> {
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: GetEventQuery) {
    const event = await this.eventRepository.getById(props.eventId);

    if (!event) {
      throw new EventNotFoundException(props.eventId);
    }

    return event;
  }
}

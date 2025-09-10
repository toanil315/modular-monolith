import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../abstractions/entity';
import { EventCreatedDomainEvent } from './event-created.domain-event';
import { EventStatus } from './event-status';

export class Event extends Entity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly location: string,
    public readonly status: EventStatus,
    public readonly startsAt: number,
    public readonly endsAt: number,
  ) {
    super();
  }

  static create(
    title: string,
    description: string,
    location: string,
    startsAt: number,
    endsAt: number,
  ) {
    const event = new Event(
      uuidV4(),
      title,
      description,
      location,
      EventStatus.Draft,
      startsAt,
      endsAt,
    );

    event.raise(new EventCreatedDomainEvent(event.id));

    return event;
  }
}

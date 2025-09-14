import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../common/domain/entity';
import { EventStatus } from './event-status';
import { EventExceptions } from './event.exception';
import { EventDomainEvent } from './event.domain-event';
import { Category } from '../categories/category';
import { TicketType } from '../ticket-types/ticket-type';

export class Event extends Entity {
  constructor(
    public id: string,
    public categoryId: string,
    public title: string,
    public description: string,
    public location: string,
    public status: EventStatus,
    public startsAt: number,
    public endsAt: number,
    public ticketTypes: TicketType[] = [],
  ) {
    super();
  }

  static create(
    category: Category,
    title: string,
    description: string,
    location: string,
    startsAt: number,
    endsAt: number,
  ) {
    const event = new Event(
      uuidV4(),
      category.id,
      title,
      description,
      location,
      EventStatus.Draft,
      startsAt,
      endsAt,
    );

    event.raise(new EventDomainEvent.EventCreatedDomainEvent(event.id));

    return event;
  }

  publish() {
    if (this.status !== EventStatus.Draft) {
      throw new EventExceptions.EventNotDraftException();
    }

    this.status = EventStatus.Published;

    this.raise(new EventDomainEvent.EventPublishedDomainEvent(this.id));
    return this;
  }

  reschedule(startsAt: number, endsAt: number) {
    if (this.startsAt == startsAt && this.endsAt == endsAt) {
      return;
    }

    if (startsAt < Date.now()) {
      throw new EventExceptions.EventStartDateInPastException();
    }

    if (startsAt > endsAt) {
      throw new EventExceptions.EventEndDatePrecedesStartDateException();
    }

    this.startsAt = startsAt;
    this.endsAt = endsAt;

    this.raise(
      new EventDomainEvent.EventRescheduledDomainEvent(
        this.id,
        this.startsAt,
        this.endsAt,
      ),
    );
    return this;
  }

  cancel() {
    if (this.status === EventStatus.Canceled) {
      throw new EventExceptions.EventAlreadyCanceledException();
    }

    if (this.startsAt < Date.now()) {
      throw new EventExceptions.EventAlreadyStartedException();
    }

    this.status = EventStatus.Canceled;

    this.raise(new EventDomainEvent.EventCanceledDomainEvent(this.id));
    return this;
  }
}

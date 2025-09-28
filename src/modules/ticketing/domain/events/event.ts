import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../common/domain/entity';

import { Result } from 'src/modules/common/domain/result';
import { EventStatus } from './event-status';
import { EventDomainEvent } from './event.domain-event';
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
    categoryId: string,
    title: string,
    description: string,
    location: string,
    startsAt: number,
    endsAt: number,
  ) {
    const event = new Event(
      uuidV4(),
      categoryId,
      title,
      description,
      location,
      EventStatus.Draft,
      startsAt,
      endsAt,
    );

    return Result.success(event);
  }

  refundPayment() {
    this.raise(new EventDomainEvent.EventPaymentsRefundedDomainEvent(this.id));
    return Result.success(this);
  }

  archiveTickets() {
    this.raise(new EventDomainEvent.EventTicketsArchivedDomainEvent(this.id));
    return Result.success(this);
  }
}

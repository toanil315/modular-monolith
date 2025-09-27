import { Entity } from 'src/modules/common/domain/entity';
import { v4 as uuidV4 } from 'uuid';
import { Result } from 'src/modules/common/domain/result';
import { TicketDomainEvent } from './ticket.domain-event';
import { ulid } from 'ulid';
import { Order } from '../orders/order';
import { TicketType } from '../events/ticket-type';
import { TicketErrors } from './ticket.error';

export class Ticket extends Entity {
  constructor(
    public id: string,
    public customerId: string,
    public orderId: string,
    public eventId: string,
    public ticketTypeId: string,
    public code: string,
    public createdAtUtc: Date,
    public archived: boolean,
  ) {
    super();
  }

  static create(order: Order, ticketType: TicketType) {
    const ticket = new Ticket(
      uuidV4(),
      order.customerId,
      order.id,
      ticketType.eventId,
      ticketType.id,
      `TC_${ulid()}`,
      new Date(),
      false,
    );

    ticket.raise(new TicketDomainEvent.TicketCreatedDomainEvent(ticket.id));

    return Result.success(ticket);
  }

  archive() {
    if (this.archived) {
      return Result.failure(TicketErrors.TicketAlreadyArchived);
    }

    this.archived = true;

    this.raise(new TicketDomainEvent.TicketArchivedDomainEvent(this.id, this.code));

    return Result.success(this);
  }

  isArchived(): boolean {
    return this.archived;
  }
}

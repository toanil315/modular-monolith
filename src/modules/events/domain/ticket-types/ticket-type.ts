import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../abstractions/entity';
import { TicketTypeDomainEvent } from './ticket-type.domain-event';
import { Event } from '../events/event';

export class TicketType extends Entity {
  constructor(
    public id: string,
    public eventId: string,
    public name: string,
    public price: number,
    public currency: string,
    public quantity: number,
  ) {
    super();
  }

  static create(
    event: Event,
    name: string,
    price: number,
    currency: string,
    quantity: number,
  ): TicketType {
    const ticketType = new TicketType(
      uuidV4(),
      event.id,
      name,
      price,
      currency,
      quantity,
    );

    ticketType.raise(
      new TicketTypeDomainEvent.TicketTypeCreatedDomainEvent(ticketType.id),
    );

    return ticketType;
  }

  updatePrice(price: number): this {
    if (this.price === price) return this;

    this.price = price;

    this.raise(
      new TicketTypeDomainEvent.TicketTypePriceChangedDomainEvent(
        this.id,
        this.price,
      ),
    );

    return this;
  }
}

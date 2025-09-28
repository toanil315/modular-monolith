import { Entity } from 'src/modules/common/domain/entity';
import { Result } from 'src/modules/common/domain/result';
import { TicketTypeError } from './ticket-type.error';

export class TicketType extends Entity {
  constructor(
    public id: string,
    public eventId: string,
    public name: string,
    public price: number,
    public currency: string,
    public quantity: number,
    public availableQuantity: number,
  ) {
    super();
  }

  static create(
    ticketTypeId: string,
    eventId: string,
    name: string,
    price: number,
    currency: string,
    quantity: number,
    availableQuantity: number,
  ) {
    const newTicketType = new TicketType(
      ticketTypeId,
      eventId,
      name,
      price,
      currency,
      quantity,
      availableQuantity,
    );

    return Result.success(newTicketType);
  }

  updateAvailableQuantity(quantity: number) {
    if (this.availableQuantity < quantity) {
      return Result.failure(
        TicketTypeError.TicketTypeNotEnoughQuantityError(this.availableQuantity),
      );
    }

    this.availableQuantity -= quantity;

    return Result.success(this);
  }
}

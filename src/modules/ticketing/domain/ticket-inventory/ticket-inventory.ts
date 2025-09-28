import { Entity } from 'src/modules/common/domain/entity';
import { TicketInventoryDomainEvent } from './ticket-inventory.domain-event';
import { Result } from 'src/modules/common/domain/result';
import { TicketInventoryError } from './ticket-inventory.error';

export class TicketInventory extends Entity {
  constructor(
    public id: string,
    public quantity: number,
    public availableQuantity: number,
  ) {
    super();
  }

  static create(ticketTypeId: string, quantity: number, availableQuantity: number) {
    const newTicketInventory = new TicketInventory(ticketTypeId, quantity, availableQuantity);

    newTicketInventory.raise(
      new TicketInventoryDomainEvent.TicketInventoryCreatedDomainEvent(newTicketInventory.id),
    );

    return Result.success(newTicketInventory);
  }

  updateAvailableQuantity(quantity: number) {
    if (this.availableQuantity < quantity) {
      return Result.failure(
        TicketInventoryError.TicketInventoryNotEnoughQuantityError(this.availableQuantity),
      );
    }

    this.availableQuantity -= quantity;

    return Result.success(this);
  }
}

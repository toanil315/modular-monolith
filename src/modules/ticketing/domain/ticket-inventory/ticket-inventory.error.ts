import { BusinessError } from 'src/modules/common/domain/error';

export namespace TicketInventoryError {
  export const TicketInventoryNotEnoughQuantityError = (availableQuantity: number) =>
    BusinessError.Problem(
      'TICKET_INVENTORY.NOT_ENOUGH_QUANTITY',
      `This ticket type has ${availableQuantity} quantity available`,
    );
}

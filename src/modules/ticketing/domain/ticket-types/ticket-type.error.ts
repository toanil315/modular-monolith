import { BusinessError } from 'src/modules/common/domain/error';

export namespace TicketTypeError {
  export const TicketTypeNotFoundError = (ticketTypeId: string) =>
    BusinessError.NotFound(
      'TICKET_TYPES.NOT_FOUND',
      `The ticket type with the identifier ${ticketTypeId} was not found`,
    );

  export const TicketTypeNotEnoughQuantityError = (availableQuantity: number) =>
    BusinessError.Problem(
      'TICKET_TYPES.NOT_ENOUGH_QUANTITY',
      `The ticket type has ${availableQuantity} quantity available`,
    );
}

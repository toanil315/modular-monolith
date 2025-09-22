import { BusinessError } from 'src/modules/common/domain/error';

export namespace TicketTypeErrors {
  export const TicketTypeNotFoundError = (ticketTypeId: string) =>
    BusinessError.NotFound(
      'TICKET_TYPES.NOT_FOUND',
      `The ticket type with the identifier ${ticketTypeId} was not found`,
    );
}

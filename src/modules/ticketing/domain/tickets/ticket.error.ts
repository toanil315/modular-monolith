import { BusinessError } from 'src/modules/common/domain/error';

export namespace TicketErrors {
  export const TicketNotFoundById = (ticketId: string) =>
    BusinessError.NotFound(
      'TICKETS.NOT_FOUND',
      `The ticket with the identifier ${ticketId} was not found`,
    );

  export const TicketNotFoundByCode = (code: string) =>
    BusinessError.NotFound('TICKETS.NOT_FOUND', `The ticket with the code ${code} was not found`);

  export const TicketAlreadyArchived = BusinessError.Problem(
    'TICKETS.ALREADY_ARCHIVED',
    `The ticket is already archived`,
  );
}

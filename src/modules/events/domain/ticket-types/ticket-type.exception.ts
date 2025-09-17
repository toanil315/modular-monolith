import { BusinessError } from 'src/modules/common/domain/error';

export namespace TicketTypeExceptions {
  export class TicketTypeNotFoundException extends BusinessError {
    constructor(ticketTypeId: string) {
      super({
        code: 'TICKET_TYPES.NOT_FOUND',
        message: `The ticket type with the identifier ${ticketTypeId} was not found`,
      });
    }
  }
}

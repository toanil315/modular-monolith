import { BusinessException } from 'src/modules/common/exceptions/business/business.exception';

export namespace TicketTypeExceptions {
  export class TicketTypeNotFoundException extends BusinessException {
    constructor(ticketTypeId: string) {
      super({
        code: 'TICKET_TYPES.NOT_FOUND',
        message: `The ticket type with the identifier ${ticketTypeId} was not found`,
      });
    }
  }
}

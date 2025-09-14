import { BusinessException } from 'src/modules/common/infrastructure/exceptions/business/business.exception';

export namespace EventExceptions {
  export class EventNotFoundException extends BusinessException {
    constructor(eventId: string) {
      super({
        code: 'EVENTS.NOT_FOUND',
        message: `The event with the identifier ${eventId} was not found`,
      });
    }
  }

  export class EventStartDateInPastException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.START_DATE_IN_PAST',
        message: 'The event start date is in the past',
      });
    }
  }

  export class EventEndDatePrecedesStartDateException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.END_DATE_PRECEDES_START_DATE',
        message: 'The event end date precedes the start date',
      });
    }
  }

  export class EventNoTicketsFoundException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.NO_TICKETS_FOUND',
        message: 'The event does not have any ticket types defined',
      });
    }
  }

  export class EventNotDraftException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.NOT_DRAFT',
        message: 'The event is not in draft status',
      });
    }
  }

  export class EventAlreadyCanceledException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.ALREADY_CANCELED',
        message: 'The event was already canceled',
      });
    }
  }

  export class EventAlreadyStartedException extends BusinessException {
    constructor() {
      super({
        code: 'EVENTS.ALREADY_STARTED',
        message: 'The event has already started',
      });
    }
  }
}

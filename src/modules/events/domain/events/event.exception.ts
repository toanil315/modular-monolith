import { BusinessError } from 'src/modules/common/domain/error';

export namespace EventErrors {
  export class EventNotFoundError extends BusinessError {
    constructor(eventId: string) {
      super({
        code: 'EVENTS.NOT_FOUND',
        message: `The event with the identifier ${eventId} was not found`,
      });
    }
  }

  export class EventStartDateInPastError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.START_DATE_IN_PAST',
        message: 'The event start date is in the past',
      });
    }
  }

  export class EventEndDatePrecedesStartDateError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.END_DATE_PRECEDES_START_DATE',
        message: 'The event end date precedes the start date',
      });
    }
  }

  export class EventNoTicketsFoundError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.NO_TICKETS_FOUND',
        message: 'The event does not have any ticket types defined',
      });
    }
  }

  export class EventNotDraftError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.NOT_DRAFT',
        message: 'The event is not in draft status',
      });
    }
  }

  export class EventAlreadyCanceledError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.ALREADY_CANCELED',
        message: 'The event was already canceled',
      });
    }
  }

  export class EventAlreadyStartedError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.ALREADY_STARTED',
        message: 'The event has already started',
      });
    }
  }

  export class EventScheduleIsSameAsPreviousError extends BusinessError {
    constructor() {
      super({
        code: 'EVENTS.SAME_SCHEDULE_AS_PREVIOUS',
        message: "The event's schedule is same as previous",
      });
    }
  }
}

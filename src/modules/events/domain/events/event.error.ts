import { BusinessError } from 'src/modules/common/domain/error';

export namespace EventErrors {
  export const EventNotFoundError = (eventId: string) =>
    BusinessError.NotFound(
      'EVENTS.NOT_FOUND',
      `The event with the identifier ${eventId} was not found`,
    );

  export const EventStartDateInPastError = BusinessError.Problem(
    'EVENTS.START_DATE_IN_PAST',
    'The event start date is in the past',
  );

  export const EventEndDatePrecedesStartDateError = BusinessError.Problem(
    'EVENTS.END_DATE_PRECEDES_START_DATE',
    'The event end date precedes the start date',
  );

  export const EventNoTicketsFoundError = BusinessError.Problem(
    'EVENTS.NO_TICKETS_FOUND',
    'The event does not have any ticket types defined',
  );

  export const EventNotDraftError = BusinessError.Problem(
    'EVENTS.NOT_DRAFT',
    'The event is not in draft status',
  );

  export const EventAlreadyCanceledError = BusinessError.Problem(
    'EVENTS.ALREADY_CANCELED',
    'The event was already canceled',
  );

  export const EventAlreadyStartedError = BusinessError.Problem(
    'EVENTS.ALREADY_STARTED',
    'The event has already started',
  );

  export const EventScheduleIsSameAsPreviousError = BusinessError.Problem(
    'EVENTS.SAME_SCHEDULE_AS_PREVIOUS',
    "The event's schedule is same as previous",
  );
}

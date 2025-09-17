import { HttpStatus } from '@nestjs/common';
import { EventErrors } from '../../domain/events/event.exception';

export const EventExceptionRegistry = new Map<Function, number>([
  [EventErrors.EventNotFoundError, HttpStatus.NOT_FOUND],
  [EventErrors.EventAlreadyCanceledError, HttpStatus.CONFLICT],
  [EventErrors.EventAlreadyStartedError, HttpStatus.CONFLICT],
  [EventErrors.EventNotDraftError, HttpStatus.CONFLICT],
]);

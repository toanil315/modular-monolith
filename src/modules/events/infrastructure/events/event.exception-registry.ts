import { HttpStatus } from '@nestjs/common';
import { EventExceptions } from '../../domain/events/event.exception';

export const EventExceptionRegistry = new Map<Function, number>([
  [EventExceptions.EventNotFoundException, HttpStatus.NOT_FOUND],
  [EventExceptions.EventAlreadyCanceledException, HttpStatus.CONFLICT],
  [EventExceptions.EventAlreadyStartedException, HttpStatus.CONFLICT],
  [EventExceptions.EventNotDraftException, HttpStatus.CONFLICT],
]);

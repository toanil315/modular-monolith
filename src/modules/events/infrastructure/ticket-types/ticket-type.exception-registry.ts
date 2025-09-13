import { HttpStatus } from '@nestjs/common';
import { TicketTypeExceptions } from '../../domain/ticket-types/ticket-type.exception';

export const TicketTypeExceptionRegistry = new Map<Function, number>([
  [TicketTypeExceptions.TicketTypeNotFoundException, HttpStatus.NOT_FOUND],
]);

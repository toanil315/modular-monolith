import { CategoryExceptionRegistry } from '../categories/category.exception-registry';
import { EventExceptionRegistry } from '../events/event.exception-registry';
import { TicketTypeExceptionRegistry } from '../ticket-types/ticket-type.exception-registry';

export const ExceptionRegistry = new Map<Function, number>([
  ...EventExceptionRegistry,
  ...CategoryExceptionRegistry,
  ...TicketTypeExceptionRegistry,
]);

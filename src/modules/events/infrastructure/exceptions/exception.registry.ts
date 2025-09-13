import { CategoryExceptionRegistry } from '../categories/category.exception-registry';
import { EventExceptionRegistry } from '../events/event.exception-registry';

export const ExceptionRegistry = new Map<Function, number>([
  ...EventExceptionRegistry,
  ...CategoryExceptionRegistry,
]);

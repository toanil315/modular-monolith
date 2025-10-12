import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/domain-event';
import { IntegrationEvent } from '../messagings/integration-event';

/**
 * Wrapper around OnEvent() that provides the following options:
 * { suppressErrors: false, async: true, promisify: true }
 *
 * @see: https://docs.nestjs.com/techniques/events#listening-to-events
 */
export function EventHandler<T extends DomainEvent | IntegrationEvent>(
  event: new (...args: never[]) => T,
): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    OnEvent(event.name, { suppressErrors: false, async: true, promisify: true })(
      target,
      propertyKey,
      descriptor,
    );
  };
}

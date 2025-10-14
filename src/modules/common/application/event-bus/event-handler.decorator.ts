import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent, DomainEventConstructor } from '../../domain/domain-event';
import { BaseEventHandler } from './event-handler.base';

/**
 * Strongly typed EventHandler decorator.
 *
 * ✅ Registers the handler with NestJS event emitter
 * ✅ Uses BaseEventHandler's outbox-consumer logic
 * ✅ Prevents re-processing of already handled events
 */
export function EventHandler<TEvent extends DomainEvent>(
  event: DomainEventConstructor,
): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: BaseEventHandler, ...args: [TEvent]) {
      const [eventInstance] = args;

      // Make sure handler inherits from BaseEventHandler
      if (!(this instanceof BaseEventHandler)) {
        throw new Error(
          'EventHandler decorator must be implemented within class inherited from BaseEventHandler',
        );
      }

      // --- Outbox consumer logic ---
      const alreadyProcessed = await this.isProcessed(eventInstance);
      if (alreadyProcessed) {
        return;
      }

      // Execute user handler logic
      const result = await originalMethod.apply(this, args);

      // Mark event as consumed
      await this.saveConsumedMessage(eventInstance);

      return result;
    };

    // Register with Nest event emitter
    OnEvent(event.type, {
      suppressErrors: false,
      async: true,
      promisify: true,
    })(target, propertyKey, descriptor);
  };
}

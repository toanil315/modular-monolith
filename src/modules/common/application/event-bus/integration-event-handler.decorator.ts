import { OnEvent } from '@nestjs/event-emitter';
import { IntegrationEvent, IntegrationEventConstructor } from '../messagings/integration-event';
import { BaseIntegrationEventHandler } from './integration-event-handler.base';

/**
 * Strongly typed EventHandler decorator.
 *
 * ✅ Registers the handler with NestJS event emitter
 * ✅ Uses BaseIntegrationEventHandler's inbox-consumer logic
 * ✅ Prevents re-processing of already handled events
 */
export function IntegrationEventHandler<TEvent extends IntegrationEvent>(
  event: IntegrationEventConstructor,
): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: BaseIntegrationEventHandler, ...args: [TEvent]) {
      const [eventInstance] = args;

      // Make sure handler inherits from BaseEventHandler
      if (!(this instanceof BaseIntegrationEventHandler)) {
        throw new Error(
          'IntegrationEventHandler decorator must be implemented within class inherited from BaseIntegrationEventHandler',
        );
      }

      // --- Inbox consumer logic ---
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

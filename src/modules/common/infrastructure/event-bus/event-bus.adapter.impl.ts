import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Provider } from '@nestjs/common';
import { DomainEvent } from '../../domain/domain-event';
import {
  EVENT_BUS_ADAPTER_TOKEN,
  EventBusAdapter,
} from '../../application/event-bus/event-bus.adapter';

@Injectable()
export class EventBusAdapterImpl implements EventBusAdapter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Synchronous event emitter using EventEmitter2 provided by @nestjs/event-emitter.
   * @docs: Return the results of the listeners via Promise.all.
   * @see: https://github.com/EventEmitter2/EventEmitter2#emitteremitasyncevent--eventns-arg1-arg2-
   * @see https://docs.nestjs.com/techniques/events
   */
  async publish<TEvent extends DomainEvent>(events: TEvent[]): Promise<void> {
    await Promise.all(
      events.map((event) => {
        return this.eventEmitter.emitAsync(event.type, event);
      }),
    );
  }
}

export const EventBusAdapterProvider: Provider = {
  provide: EVENT_BUS_ADAPTER_TOKEN,
  useClass: EventBusAdapterImpl,
};

import { Inject, Injectable, Provider } from '@nestjs/common';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../application/abstractions/integration-event.publisher';
import { User } from '../../domain/users/user';
import { UsersIntegrationEvent } from '../events/users.integration-event';
import {
  EVENT_BUS_ADAPTER_TOKEN,
  EventBusAdapter,
} from 'src/modules/common/application/event-bus/event-bus.adapter';

@Injectable()
export class IntegrationEventsPublisherImpl implements IntegrationEventsPublisher {
  constructor(@Inject(EVENT_BUS_ADAPTER_TOKEN) private readonly eventBus: EventBusAdapter) {}

  async publishUserRegistered(user: User) {
    await this.eventBus.publish([
      new UsersIntegrationEvent.UserRegisteredIntegrationEvent(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
      ),
    ]);
  }
}

export const IntegrationEventsPublisherProvider: Provider = {
  provide: INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  useClass: IntegrationEventsPublisherImpl,
};

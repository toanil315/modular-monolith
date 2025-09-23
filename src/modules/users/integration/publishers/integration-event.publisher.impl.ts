import { Injectable, Provider } from '@nestjs/common';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../application/abstractions/integration-event.publisher';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../../domain/users/user';
import { UsersIntegrationEvent } from '../events/users.integration-event';

@Injectable()
export class IntegrationEventsPublisherImpl implements IntegrationEventsPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publishUserRegistered(user: User) {
    await this.eventBus.publish(
      new UsersIntegrationEvent.UserRegisteredIntegrationEvent(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
      ),
    );
  }
}

export const IntegrationEventsPublisherProvider: Provider = {
  provide: INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  useClass: IntegrationEventsPublisherImpl,
};

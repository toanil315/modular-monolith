import { User } from 'src/modules/users/domain/users/user';

export const INTEGRATION_EVENTS_PUBLISHER_TOKEN = 'INTEGRATION_EVENTS_PUBLISHER_TOKEN';

export interface IntegrationEventsPublisher {
  publishUserRegistered: (user: User) => Promise<void>;
}

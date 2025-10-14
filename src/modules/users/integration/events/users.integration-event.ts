import { IntegrationEvent } from 'src/modules/common/application/messagings/integration-event';

export namespace UsersIntegrationEvent {
  export class UserRegisteredIntegrationEvent extends IntegrationEvent {
    static readonly type = 'IntegrationEvent.UserRegistered';

    constructor(
      public readonly userId: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly email: string,
    ) {
      super(UserRegisteredIntegrationEvent.type);
    }
  }
}

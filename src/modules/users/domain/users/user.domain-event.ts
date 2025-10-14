import { DomainEvent } from '../../../common/domain/domain-event';

export namespace UserDomainEvent {
  export class UserRegisteredDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.UserRegistered';

    constructor(public readonly userId: string) {
      super(UserRegisteredDomainEvent.type);
    }
  }

  export class UserProfileUpdatedDomainEvent extends DomainEvent {
    static readonly type = 'DomainEvent.UserProfileUpdated';

    constructor(
      public readonly userId: string,
      public readonly firstName: string,
      public readonly lastName: string,
    ) {
      super(UserProfileUpdatedDomainEvent.type);
    }
  }
}

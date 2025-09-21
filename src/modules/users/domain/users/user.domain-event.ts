import { DomainEvent } from '../../../common/domain/domain-event';

export namespace UserDomainEvent {
  export class UserRegisteredDomainEvent extends DomainEvent {
    constructor(public readonly userId: string) {
      super('DomainEvent.UserRegistered');
    }
  }

  export class UserProfileUpdatedDomainEvent extends DomainEvent {
    constructor(
      public readonly userId: string,
      public readonly firstName: string,
      public readonly lastName: string,
    ) {
      super('DomainEvent.UserProfileUpdated');
    }
  }
}

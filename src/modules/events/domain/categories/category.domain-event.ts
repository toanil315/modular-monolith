import { DomainEvent } from '../abstractions/domain-event';

export namespace CategoryDomainEvent {
  export class CategoryCreatedDomainEvent extends DomainEvent {
    constructor(public readonly categoryId: string) {
      super('DomainEvent.CategoryCreated');
    }
  }

  export class CategoryArchivedDomainEvent extends DomainEvent {
    constructor(public readonly categoryId: string) {
      super('DomainEvent.CategoryArchived');
    }
  }

  export class CategoryNameChangedDomainEvent extends DomainEvent {
    constructor(
      public readonly categoryId: string,
      public readonly name: string,
    ) {
      super('DomainEvent.CategoryNameChanged');
    }
  }
}

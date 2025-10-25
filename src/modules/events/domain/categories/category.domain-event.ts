import { DomainEvent } from '../../../common/domain/domain-event';

export namespace CategoryDomainEvent {
  export class CategoryCreatedDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.CategoryCreated';

    constructor(public readonly categoryId: string) {
      super(CategoryCreatedDomainEvent.type);
    }
  }

  export class CategoryArchivedDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.CategoryArchived';

    constructor(public readonly categoryId: string) {
      super(CategoryArchivedDomainEvent.type);
    }
  }

  export class CategoryNameChangedDomainEvent extends DomainEvent {
    static readonly type = 'Events.DomainEvent.CategoryNameChanged';

    constructor(
      public readonly categoryId: string,
      public readonly name: string,
    ) {
      super(CategoryNameChangedDomainEvent.type);
    }
  }
}

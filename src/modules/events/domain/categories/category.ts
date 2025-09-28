import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../common/domain/entity';
import { CategoryDomainEvent } from './category.domain-event';
import { Result } from 'src/modules/common/domain/result';

export class Category extends Entity {
  constructor(
    public id: string,
    public name: string,
    public isArchived: boolean,
  ) {
    super();
  }

  static create(name: string) {
    const category = new Category(uuidV4(), name, false);

    category.raise(new CategoryDomainEvent.CategoryCreatedDomainEvent(category.id));

    return Result.success(category);
  }

  archive() {
    if (this.isArchived) return Result.success(this);

    this.isArchived = true;

    this.raise(new CategoryDomainEvent.CategoryArchivedDomainEvent(this.id));
    return Result.success(this);
  }

  changeName(name: string) {
    if (this.name === name) {
      return Result.success(this);
    }

    this.name = name;

    this.raise(new CategoryDomainEvent.CategoryNameChangedDomainEvent(this.id, this.name));
    return Result.success(this);
  }
}

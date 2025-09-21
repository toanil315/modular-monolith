import { Entity } from 'src/modules/common/domain/entity';
import { v4 as uuidV4 } from 'uuid';
import { UserDomainEvent } from './user.domain-event';
import { Result } from 'src/modules/common/domain/result';
import { UserErrors } from './user.exception';

export class User extends Entity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
  ) {
    super();
  }

  static create(firstName: string, lastName: string, email: string) {
    const user = new User(uuidV4(), firstName, lastName, email);

    user.raise(new UserDomainEvent.UserRegisteredDomainEvent(user.id));

    return Result.success(user);
  }

  update(firstName: string, lastName: string) {
    if (firstName == this.firstName && lastName == this.firstName) {
      return Result.failure(UserErrors.UserIsSameAsPreviousError);
    }

    this.firstName = firstName;
    this.lastName = lastName;

    this.raise(
      new UserDomainEvent.UserProfileUpdatedDomainEvent(
        this.id,
        this.firstName,
        this.lastName,
      ),
    );

    return Result.success(this);
  }
}

import { Entity } from 'src/modules/common/domain/entity';
import { Result } from 'src/modules/common/domain/result';

export class Customer extends Entity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
  ) {
    super();
  }

  static create(id: string, firstName: string, lastName: string, email: string) {
    const user = new Customer(id, firstName, lastName, email);
    return Result.success(user);
  }

  update(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    return Result.success(this);
  }
}

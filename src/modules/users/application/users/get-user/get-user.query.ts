import { Query } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { User } from 'src/modules/users/domain/users/user';

export class GetUserQuery extends Query<Result<User>> {
  constructor(
    public readonly props: {
      id: string;
    },
  ) {
    super();
  }
}

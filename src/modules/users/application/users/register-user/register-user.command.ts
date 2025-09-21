import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { User } from 'src/modules/users/domain/users/user';

export class RegisterUserCommand extends Command<Result<User>> {
  constructor(
    public readonly props: {
      firstName: string;
      lastName: string;
      email: string;
    },
  ) {
    super();
  }
}

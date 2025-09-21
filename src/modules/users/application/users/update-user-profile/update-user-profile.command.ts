import { Command } from '@nestjs/cqrs';
import { Result } from 'src/modules/common/domain/result';
import { User } from 'src/modules/users/domain/users/user';

export class UpdateUserProfileCommand extends Command<Result<User>> {
  constructor(
    public readonly props: {
      id: string;
      firstName: string;
      lastName: string;
    },
  ) {
    super();
  }
}

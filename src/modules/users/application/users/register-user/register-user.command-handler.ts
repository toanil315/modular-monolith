import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/infrastructure/users/user.repository.impl';
import { UserRepository } from 'src/modules/users/domain/users/user.repository';
import { User } from 'src/modules/users/domain/users/user';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ props }: RegisterUserCommand) {
    const result = User.create(props.firstName, props.lastName, props.email);

    if (!result.isSuccess) {
      return result;
    }

    await this.userRepository.save(result.value);
    return result;
  }
}

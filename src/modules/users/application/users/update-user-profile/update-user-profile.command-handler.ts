import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserProfileCommand } from './update-user-profile.command';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/infrastructure/users/user.repository.impl';
import { UserRepository } from 'src/modules/users/domain/users/user.repository';
import { Result } from 'src/modules/common/domain/result';
import { UserErrors } from 'src/modules/users/domain/users/user.error';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ props }: UpdateUserProfileCommand) {
    const user = await this.userRepository.getById(props.id);

    if (!user) {
      return Result.failure(UserErrors.UserNotFoundError(props.id));
    }

    const result = user.update(props.firstName, props.lastName);

    if (!result.isSuccess) {
      return result;
    }

    await this.userRepository.save(result.value);
    return result;
  }
}

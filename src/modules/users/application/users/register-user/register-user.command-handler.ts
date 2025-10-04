import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/infrastructure/users/user.repository.impl';
import { UserRepository } from 'src/modules/users/domain/users/user.repository';
import { User } from 'src/modules/users/domain/users/user';
import {
  IDENTITY_PROVIDER_SERVICE_TOKEN,
  IdentityProviderService,
  IdentityUserModel,
} from '../../abstractions/identity/identity-provider.service';
import { Result } from 'src/modules/common/domain/result';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(IDENTITY_PROVIDER_SERVICE_TOKEN)
    private readonly identityProviderService: IdentityProviderService,
  ) {}

  async execute({ props }: RegisterUserCommand) {
    const identityIdResult = await this.identityProviderService.registerUser(
      new IdentityUserModel(props.email, props.password, props.firstName, props.lastName),
    );

    if (!identityIdResult.isSuccess) {
      return Result.failure(identityIdResult.businessError!);
    }

    const result = User.create(
      props.firstName,
      props.lastName,
      props.email,
      identityIdResult.value,
    );

    if (!result.isSuccess) {
      return result;
    }

    await this.userRepository.save(result.value);
    return result;
  }
}

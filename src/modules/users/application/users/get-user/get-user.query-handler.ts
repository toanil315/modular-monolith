import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/infrastructure/users/user.repository.impl';
import { UserRepository } from 'src/modules/users/domain/users/user.repository';
import { Result } from 'src/modules/common/domain/result';
import { UserErrors } from 'src/modules/users/domain/users/user.error';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ props }: GetUserQuery) {
    const user = await this.userRepository.getById(props.id);

    if (!user) {
      return Result.failure(UserErrors.UserNotFoundError(props.id));
    }

    return Result.success(user);
  }
}

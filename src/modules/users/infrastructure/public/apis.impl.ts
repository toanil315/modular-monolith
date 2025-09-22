import { Injectable, Provider } from '@nestjs/common';
import { GetUserByIdResponse, USERS_PUBLIC_APIS_TOKEN, UsersPublicApis } from '../../public/apis';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../../application/users/get-user/get-user.query';

@Injectable()
export class UsersPublicApisImpl implements UsersPublicApis {
  constructor(private queryBus: QueryBus) {}

  async getUserById(userId: string) {
    const result = await this.queryBus.execute(new GetUserQuery({ id: userId }));

    if (!result.isSuccess) {
      return null;
    }

    const user = result.value;
    return new GetUserByIdResponse(user.id, user.firstName, user.lastName, user.email);
  }
}

export const UsersPublicApisProvider: Provider = {
  provide: USERS_PUBLIC_APIS_TOKEN,
  useClass: UsersPublicApisImpl,
};

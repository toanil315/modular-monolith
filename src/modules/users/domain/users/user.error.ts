import { BusinessError } from 'src/modules/common/domain/error';

export namespace UserErrors {
  export const UserNotFoundError = (userId: string) =>
    BusinessError.NotFound(
      'USERS.NOT_FOUND',
      `The user with the identifier ${userId} was not found`,
    );

  export const UserWithIDPNotFoundError = (identityId: string) =>
    BusinessError.NotFound(
      'USERS.NOT_FOUND',
      `The user with the IDP identifier ${identityId} was not found`,
    );

  export const UserIsSameAsPreviousError = BusinessError.Problem(
    'USERS.SAME_INFO_AS_PREVIOUS',
    `The user' info is same as previous`,
  );
}

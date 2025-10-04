import { BusinessError } from 'src/modules/common/domain/error';

export namespace IdentityProviderErrors {
  export const EmailIsNotUnique = BusinessError.Conflict(
    'IDENTITY.EMAIL_IS_NOT_UNIQUE',
    'The specified email is not unique.',
  );

  export const IdentityServerError = BusinessError.Problem(
    'IDENTITY.SERVER_ERROR',
    'Identity provider server error.',
  );
}

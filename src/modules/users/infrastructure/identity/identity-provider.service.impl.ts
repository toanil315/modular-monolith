import { HttpStatus, Injectable, Provider } from '@nestjs/common';
import {
  IDENTITY_PROVIDER_SERVICE_TOKEN,
  IdentityProviderService,
  IdentityUserModel,
} from '../../application/abstractions/identity/identity-provider.service';
import { KeycloakClient } from './keycloak-client';
import { CredentialRepresentation, UserRepresentation } from './user-representation.model';
import { AxiosError } from 'axios';
import { Result } from 'src/modules/common/domain/result';
import { IdentityProviderErrors } from '../../application/abstractions/identity/identity-provider.error';

@Injectable()
export class IdentityProviderServiceImpl implements IdentityProviderService {
  private static PASSWORD_CREDENTIAL_TYPE = 'Password';

  constructor(private readonly keycloakClient: KeycloakClient) {}

  async registerUser(user: IdentityUserModel) {
    const userRepresentation = new UserRepresentation(
      user.email,
      user.email,
      user.firstName,
      user.lastName,
      true,
      true,
      [
        new CredentialRepresentation(
          IdentityProviderServiceImpl.PASSWORD_CREDENTIAL_TYPE,
          user.password,
          false,
        ),
      ],
    );

    try {
      const identityId = await this.keycloakClient.registerUser(userRepresentation);
      return Result.success(identityId);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.status === HttpStatus.CONFLICT) {
        return Result.failure(IdentityProviderErrors.EmailIsNotUnique);
      }

      return Result.failure(IdentityProviderErrors.IdentityServerError);
    }
  }
}

export const IdentityProviderServiceProvider: Provider = {
  provide: IDENTITY_PROVIDER_SERVICE_TOKEN,
  useClass: IdentityProviderServiceImpl,
};

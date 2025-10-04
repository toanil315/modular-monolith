import { Result } from 'src/modules/common/domain/result';

export const IDENTITY_PROVIDER_SERVICE_TOKEN = 'IDENTITY_PROVIDER_SERVICE_TOKEN';

export interface IdentityProviderService {
  registerUser: (user: IdentityUserModel) => Promise<Result<string>>;
}

export class IdentityUserModel {
  constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
  ) {}
}

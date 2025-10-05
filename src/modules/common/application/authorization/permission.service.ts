import { Result } from '../../domain/result';

export const PERMISSION_SERVICE_TOKEN = 'PERMISSION_SERVICE_TOKEN';

export interface PermissionService {
  getUserPermissions: (identityId: string) => Promise<Result<UserPermissionsResponse>>;
}

export class UserPermissionsResponse {
  constructor(
    public userId: string,
    public permissions: string[],
  ) {}
}

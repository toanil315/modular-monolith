import { SetMetadata } from '@nestjs/common';

export interface CheckPermissionOptions {
  resourceType: string;
  resourceIdParam: string; // Name of the route/body param containing resource ID
  permission: string; // The permission to check: 'view', 'edit', 'delete'
}

export const CHECK_PERMISSION_KEY = 'check_permission';

export const CheckPermission = (options: CheckPermissionOptions) =>
  SetMetadata(CHECK_PERMISSION_KEY, options);

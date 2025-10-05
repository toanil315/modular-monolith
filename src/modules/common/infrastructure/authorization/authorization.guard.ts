import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import {
  PERMISSION_SERVICE_TOKEN,
  PermissionService,
} from '../../application/authorization/permission.service';
import { CustomUserClaim } from '../../application/authorization/custom-user-claim';
import { Reflector } from '@nestjs/core';
import { Permissions } from './permission.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(PERMISSION_SERVICE_TOKEN) private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (!req) {
      return true;
    }

    const authHeader = req.headers['authorization'];

    const token = authHeader.split(' ')[1];
    const customUserClaim = await this.getCustomUserClaim(token);

    if (!customUserClaim) {
      return false;
    }

    const roles = this.reflector.get(Permissions, context.getHandler()) ?? [];
    const granted = roles.some((role) => customUserClaim.permissions.includes(role));

    if (!roles.length || granted) {
      req.custom_claim = customUserClaim;
      return true;
    }

    return false;
  }

  private async getCustomUserClaim(token: string): Promise<CustomUserClaim | null> {
    const identityUser = this.parseToken(token);

    const userPermissionResult = await this.permissionService.getUserPermissions(identityUser.sub);

    if (!userPermissionResult.isSuccess) {
      return null;
    }

    return new CustomUserClaim(
      identityUser.sub,
      userPermissionResult.value.userId,
      identityUser.email,
      identityUser.given_name,
      identityUser.family_name,
      userPermissionResult.value.permissions,
    );
  }

  private parseToken(token: string): IdentityUser {
    const parts = token.split('.');
    return JSON.parse(Buffer.from(parts[1], 'base64').toString());
  }
}

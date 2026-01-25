import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyService } from '../../../authz/policy.service';
import {
  CHECK_PERMISSION_KEY,
  CheckPermissionOptions,
} from '../../application/authorization/check-permission.decorator';

@Injectable()
export class ResourceAuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(ResourceAuthorizationGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly policyService: PolicyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionOptions = this.reflector.get<CheckPermissionOptions>(
      CHECK_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissionOptions) {
      return true; // No permission check required
    }

    const request = context.switchToHttp().getRequest();
    const userId = this.extractUserId(request);
    const resourceId = this.extractResourceId(
      request,
      permissionOptions.resourceIdParam,
    );

    if (!userId || !resourceId) {
      this.logger.warn(
        `Missing userId or resourceId. userId: ${userId}, resourceId: ${resourceId}`,
      );
      throw new ForbiddenException('Unable to determine user or resource');
    }

    this.logger.debug(
      `Checking ${permissionOptions.permission} permission for user ${userId} on ${permissionOptions.resourceType}:${resourceId}`,
    );

    const hasPermission = await this.policyService.checkPermission({
      resourceType: permissionOptions.resourceType,
      resourceId: resourceId,
      permission: permissionOptions.permission,
      subjectType: 'user',
      subjectId: userId,
    });

    if (!hasPermission) {
      this.logger.warn(
        `Permission denied: user ${userId} does not have ${permissionOptions.permission} on ${permissionOptions.resourceType}:${resourceId}`,
      );
      throw new ForbiddenException(
        `You do not have ${permissionOptions.permission} permission on this ${permissionOptions.resourceType}`,
      );
    }

    return true;
  }

  private extractUserId(request: any): string | null {
    // Extract user ID from custom_claim set by AuthorizationGuard
    // The userId field contains the internal user ID
    return request.custom_claim?.userId || null;
  }

  private extractResourceId(request: any, paramName: string): string | null {
    // Try route params first, then body
    return request.params?.[paramName] || request.body?.[paramName] || null;
  }
}

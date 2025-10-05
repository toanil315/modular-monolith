import { Injectable, Provider } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  PERMISSION_SERVICE_TOKEN,
  PermissionService,
} from 'src/modules/common/application/authorization/permission.service';
import { GetUserPermissionQuery } from '../../application/users/get-user-permission/get-user-permission.query';

@Injectable()
export class PermissionServiceImpl implements PermissionService {
  constructor(private readonly queryBus: QueryBus) {}

  getUserPermissions(identityId: string) {
    return this.queryBus.execute(new GetUserPermissionQuery({ identityId }));
  }
}

export const PermissionServiceProvider: Provider = {
  provide: PERMISSION_SERVICE_TOKEN,
  useClass: PermissionServiceImpl,
};

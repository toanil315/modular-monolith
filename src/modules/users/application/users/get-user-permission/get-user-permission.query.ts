import { Query } from '@nestjs/cqrs';
import { UserPermissionsResponse } from 'src/modules/common/application/authorization/permission.service';
import { Result } from 'src/modules/common/domain/result';

export class GetUserPermissionQuery extends Query<Result<UserPermissionsResponse>> {
  constructor(
    public readonly props: {
      identityId: string;
    },
  ) {
    super();
  }
}

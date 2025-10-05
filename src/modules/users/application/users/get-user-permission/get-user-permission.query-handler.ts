import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserPermissionQuery } from './get-user-permission.query';
import { DataSource } from 'typeorm';
import { Result } from 'src/modules/common/domain/result';
import { UserPermissionsResponse } from 'src/modules/common/application/authorization/permission.service';
import { UserErrors } from 'src/modules/users/domain/users/user.error';

@QueryHandler(GetUserPermissionQuery)
export class GetUserPermissionQueryHandler implements IQueryHandler<GetUserPermissionQuery> {
  constructor(private readonly dataSource: DataSource) {}

  async execute({ props }: GetUserPermissionQuery): Promise<Result<UserPermissionsResponse>> {
    const query = `
        SELECT 
            u.id as "userId",
            array_agg(DISTINCT rp.permission_id) AS permissions
        FROM "users"."users" u
        JOIN "users"."user_roles" ur
        ON u.id = ur."user_id"
        JOIN "users"."role_permissions" rp
        ON rp."role_id" = ur."role_id"
        WHERE u."identity_id" = $1
        GROUP BY u.id 
    `;

    const rows = await this.dataSource.query<{ userId: string; permissions: string[] }[]>(query, [
      props.identityId,
    ]);

    if (!rows.length) {
      return Result.failure(UserErrors.UserWithIDPNotFoundError(props.identityId));
    }

    const userPermissions = rows[0];

    return Result.success(
      new UserPermissionsResponse(userPermissions.userId, userPermissions.permissions),
    );
  }
}

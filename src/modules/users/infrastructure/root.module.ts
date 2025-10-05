import { Module, Provider } from '@nestjs/common';
import { UsersPublicApisProvider } from '../application/public/apis.impl';
import { IntegrationEventsPublisherProvider } from '../integration/publishers/integration-event.publisher.impl';
import { UsersController } from '../presentation/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './users/user.entity';
import { UserRepositoryProvider } from './users/user.repository.impl';
import { GetUserQueryHandler } from '../application/users/get-user/get-user.query-handler';
import { RegisterUserCommandHandler } from '../application/users/register-user/register-user.command-handler';
import { UpdateUserProfileCommandHandler } from '../application/users/update-user-profile/update-user-profile.command-handler';
import { UserRegisteredDomainEventHandler } from '../application/users/register-user/user-registered.domain-event-handler';
import { HttpModule } from '@nestjs/axios';
import { IdentityProviderServiceProvider } from './identity/identity-provider.service.impl';
import { KeycloakClient } from './identity/keycloak-client';
import { RoleTypeOrmEntity } from './users/role.entity';
import { PermissionTypeOrmEntity } from './users/permisison.entity';
import { GetUserPermissionQueryHandler } from '../application/users/get-user-permission/get-user-permission.query-handler';
import { PermissionServiceProvider } from './authorization/permission.service.impl';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from 'src/modules/common/application/authorization/authorization.guard';

const usersProviders: Provider[] = [
  UserRepositoryProvider,

  GetUserQueryHandler,
  GetUserPermissionQueryHandler,

  RegisterUserCommandHandler,
  UpdateUserProfileCommandHandler,

  UserRegisteredDomainEventHandler,

  PermissionServiceProvider,
];

const identityProviders: Provider[] = [IdentityProviderServiceProvider, KeycloakClient];

const authorizationProviders: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: AuthorizationGuard,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrmEntity, RoleTypeOrmEntity, PermissionTypeOrmEntity]),
    HttpModule.register({}),
  ],
  providers: [
    UsersPublicApisProvider,
    IntegrationEventsPublisherProvider,
    ...authorizationProviders,
    ...usersProviders,
    ...identityProviders,
  ],
  controllers: [UsersController],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

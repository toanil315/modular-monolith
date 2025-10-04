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

const usersProviders: Provider[] = [
  UserRepositoryProvider,
  GetUserQueryHandler,

  RegisterUserCommandHandler,
  UpdateUserProfileCommandHandler,

  UserRegisteredDomainEventHandler,
];

const identityProviders: Provider[] = [IdentityProviderServiceProvider, KeycloakClient];

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity]), HttpModule.register({})],
  providers: [
    UsersPublicApisProvider,
    IntegrationEventsPublisherProvider,
    ...usersProviders,
    ...identityProviders,
  ],
  controllers: [UsersController],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

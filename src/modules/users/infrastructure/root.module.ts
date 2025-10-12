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
import { AuthorizationGuard } from 'src/modules/common/infrastructure/authorization/authorization.guard';
import {
  USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE,
  UserOutboxConfigProvider,
} from './outbox/outbox.config';
import { UsersOutboxMessageTypeOrmEntity } from './outbox/outbox-message.entity';
import { OutboxPersistenceHandlerProvider } from './outbox/outbox-persistence.handler';
import { BullModule } from '@nestjs/bullmq';
import { OutboxJobScheduler } from './outbox/outbox.job-sheduler';
import { OutboxMessageProcessor } from './outbox/outbox.processor';
import { DomainEventRegistryProvider } from './outbox/domain-event.registry';

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

const outboxProviders: Provider[] = [
  UserOutboxConfigProvider,
  OutboxPersistenceHandlerProvider,
  OutboxJobScheduler,
  OutboxMessageProcessor,
  DomainEventRegistryProvider,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      PermissionTypeOrmEntity,
      UsersOutboxMessageTypeOrmEntity,
    ]),
    HttpModule.register({}),
    BullModule.registerQueue({
      name: USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE,
    }),
  ],
  providers: [
    UsersPublicApisProvider,
    IntegrationEventsPublisherProvider,
    ...authorizationProviders,
    ...usersProviders,
    ...identityProviders,
    ...outboxProviders,
  ],
  controllers: [UsersController],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

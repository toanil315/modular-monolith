import { Module, Provider } from '@nestjs/common';
import { UsersPublicApisProvider } from './application/public/apis.impl';
import { IntegrationEventsPublisherProvider } from './integration/publishers/integration-event.publisher.impl';
import { UsersController } from './presentation/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './infrastructure/users/user.entity';
import { UserRepositoryProvider } from './infrastructure/users/user.repository.impl';
import { GetUserQueryHandler } from './application/users/get-user/get-user.query-handler';
import { RegisterUserCommandHandler } from './application/users/register-user/register-user.command-handler';
import { UpdateUserProfileCommandHandler } from './application/users/update-user-profile/update-user-profile.command-handler';
import { UserRegisteredDomainEventHandler } from './application/users/register-user/user-registered.domain-event-handler';
import { HttpModule } from '@nestjs/axios';
import { IdentityProviderServiceProvider } from './infrastructure/identity/identity-provider.service.impl';
import { KeycloakClient } from './infrastructure/identity/keycloak-client';
import { RoleTypeOrmEntity } from './infrastructure/users/role.entity';
import { PermissionTypeOrmEntity } from './infrastructure/users/permisison.entity';
import { GetUserPermissionQueryHandler } from './application/users/get-user-permission/get-user-permission.query-handler';
import { PermissionServiceProvider } from './infrastructure/authorization/permission.service.impl';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from 'src/modules/common/infrastructure/authorization/authorization.guard';
import {
  USERS_OUTBOX_MESSAGE_PROCESSOR_JOB_QUEUE,
  UserOutboxConfigProvider,
} from './infrastructure/outbox/outbox.config';
import { UsersOutboxMessageTypeOrmEntity } from './infrastructure/outbox/outbox-message.entity';
import { OutboxPersistenceHandlerProvider } from './infrastructure/outbox/outbox-persistence.handler';
import { BullModule } from '@nestjs/bullmq';
import { OutboxJobScheduler } from './infrastructure/outbox/outbox.job-sheduler';
import { OutboxMessageProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxConsumerRepositoryProvider } from './infrastructure/outbox/outbox-consumed-message.repository';
import { UsersOutboxConsumedMessageTypeOrmEntity } from './infrastructure/outbox/outbox-consumed-message.entity';

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
  OutboxConsumerRepositoryProvider,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      PermissionTypeOrmEntity,
      UsersOutboxMessageTypeOrmEntity,
      UsersOutboxConsumedMessageTypeOrmEntity,
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

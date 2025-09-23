import { Module, Provider } from '@nestjs/common';
import { UsersPublicApisProvider } from './public/apis.impl';
import { IntegrationEventsPublisherProvider } from '../integration/publishers/integration-event.publisher.impl';
import { UsersController } from '../presentation/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './users/user.entity';
import { UserRepositoryProvider } from './users/user.repository.impl';
import { GetUserQueryHandler } from '../application/users/get-user/get-user.query-handler';
import { RegisterUserCommandHandler } from '../application/users/register-user/register-user.command-handler';
import { UpdateUserProfileCommandHandler } from '../application/users/update-user-profile/update-user-profile.command-handler';
import { UserRegisteredDomainEventHandler } from '../application/users/register-user/user-registered.domain-event-handler';

const usersProviders: Provider[] = [
  UserRepositoryProvider,
  GetUserQueryHandler,

  RegisterUserCommandHandler,
  UpdateUserProfileCommandHandler,

  UserRegisteredDomainEventHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  providers: [UsersPublicApisProvider, IntegrationEventsPublisherProvider, ...usersProviders],
  controllers: [UsersController],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

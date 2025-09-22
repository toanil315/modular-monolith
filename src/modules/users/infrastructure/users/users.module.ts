import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './user.entity';
import { UserRepositoryProvider } from './user.repository.impl';
import { GetUserQueryHandler } from '../../application/users/get-user/get-user.query-handler';
import { RegisterUserCommandHandler } from '../../application/users/register-user/register-user.command-handler';
import { UpdateUserProfileCommandHandler } from '../../application/users/update-user-profile/update-user-profile.command-handler';
import { UsersController } from '../../presentation/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  providers: [
    UserRepositoryProvider,

    GetUserQueryHandler,

    RegisterUserCommandHandler,
    UpdateUserProfileCommandHandler,
  ],
  controllers: [UsersController],
})
export class UsersModule {}

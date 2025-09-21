import { Module } from '@nestjs/common';
import { UsersDatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersDatabaseModule, UsersModule],
})
export class RootUsersModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersPublicApisProvider } from './public/apis.impl';

@Module({
  imports: [UsersModule],
  providers: [UsersPublicApisProvider],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersPublicApisProvider } from './public/apis.impl';
import { UsersIntegrationModule } from './integration/integration.module';

@Module({
  imports: [UsersModule, UsersIntegrationModule],
  providers: [UsersPublicApisProvider],
  exports: [UsersPublicApisProvider],
})
export class RootUsersModule {}

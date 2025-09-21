import { Module } from '@nestjs/common';
import { RootEventsModule } from './modules/events/infrastructure/root.module';
import { CommonModule } from './modules/common/infrastructure/root.module';
import { RootUsersModule } from './modules/users/infrastructure/root.module';

@Module({
  imports: [CommonModule, RootEventsModule, RootUsersModule],
})
export class AppModule {}

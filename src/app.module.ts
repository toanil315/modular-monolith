import { Module } from '@nestjs/common';
import { RootEventsModule } from './modules/events/root.module';
import { CommonModule } from './modules/common/root.module';
import { RootUsersModule } from './modules/users/root.module';
import { RootTicketingModule } from './modules/ticketing/root.module';
import { RootWorkflowModule } from './modules/workflows/root.module';
import { AuthzModule } from './modules/authz/authz.module';

@Module({
  imports: [
    AuthzModule,
    CommonModule,
    RootEventsModule,
    RootUsersModule,
    RootTicketingModule,
    RootWorkflowModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { RootEventsModule } from './modules/events/root.module';
import { CommonModule } from './modules/common/root.module';
import { RootUsersModule } from './modules/users/root.module';
import { RootTicketingModule } from './modules/ticketing/root.module';
import { RootWorkflowModule } from './modules/workflows/root.module';
import { TestRabbitMQModule } from './modules/test-rabbit/test.module';

@Module({
  imports: [
    CommonModule,
    RootEventsModule,
    RootUsersModule,
    RootTicketingModule,
    RootWorkflowModule,

    TestRabbitMQModule,
  ],
})
export class AppModule {}

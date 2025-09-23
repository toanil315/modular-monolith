import { Module } from '@nestjs/common';
import { UserRegisteredIntegrationEventHandler } from '../../integration/handlers/user-registered.integration-event-handler';

@Module({
  providers: [UserRegisteredIntegrationEventHandler],
})
export class TicketingIntegrationModule {}

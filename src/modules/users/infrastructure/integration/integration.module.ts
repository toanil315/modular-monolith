import { Module } from '@nestjs/common';
import { IntegrationEventsPublisherProvider } from '../../integration/publishers/integration-event.publisher.impl';

@Module({
  providers: [IntegrationEventsPublisherProvider],
  exports: [IntegrationEventsPublisherProvider],
})
export class UsersIntegrationModule {}

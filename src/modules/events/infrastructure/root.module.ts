import { Module } from '@nestjs/common';
import { EventsDatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.modules';

@Module({
  imports: [EventsDatabaseModule, EventsModule],
})
export class RootEventsModule {}

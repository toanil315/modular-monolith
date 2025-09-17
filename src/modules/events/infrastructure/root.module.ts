import { Module } from '@nestjs/common';
import { EventsDatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { TicketTypesModule } from './ticket-types/ticke-types.module';

@Module({
  imports: [
    EventsDatabaseModule,
    EventsModule,
    CategoriesModule,
    TicketTypesModule,
  ],
})
export class RootEventsModule {}

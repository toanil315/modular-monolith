import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { TicketTypesModule } from './ticket-types/ticke-types.module';

@Module({
  imports: [EventsModule, CategoriesModule, TicketTypesModule],
})
export class RootEventsModule {}

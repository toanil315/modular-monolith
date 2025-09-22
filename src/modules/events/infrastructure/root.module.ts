import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { TicketTypesModule } from './ticket-types/ticke-types.module';
import { EventsPublicApisProvider } from './public/apis.impl';

@Module({
  imports: [EventsModule, CategoriesModule, TicketTypesModule],
  providers: [EventsPublicApisProvider],
  exports: [EventsPublicApisProvider],
})
export class RootEventsModule {}

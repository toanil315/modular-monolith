import { Module } from '@nestjs/common';
import { EventsDatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { ExceptionRegistry } from './exceptions/exception.registry';
import { CategoriesModule } from './categories/categories.module';
import { TicketTypesModule } from './ticket-types/ticke-types.module';
import { BusinessExceptionProvider } from 'src/modules/common/infrastructure/exceptions/business/business-exception.provider';

@Module({
  imports: [
    EventsDatabaseModule,
    EventsModule,
    CategoriesModule,
    TicketTypesModule,
  ],
  providers: [...BusinessExceptionProvider.get(ExceptionRegistry)],
})
export class RootEventsModule {}

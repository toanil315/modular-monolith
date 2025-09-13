import { Module } from '@nestjs/common';
import { EventsDatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { APP_FILTER } from '@nestjs/core';
import { BusinessExceptionFilter } from 'src/modules/common/exceptions/business/business-exception.filter';
import { EXCEPTION_REGISTRY } from 'src/modules/common/exceptions/business/exception-registry.token';
import { ExceptionRegistry } from './exceptions/exception.registry';
import { CategoriesModule } from './categories/categories.module';
import { TicketTypesModule } from './ticket-types/ticke-types.module';

@Module({
  imports: [
    EventsDatabaseModule,
    EventsModule,
    CategoriesModule,
    TicketTypesModule,
  ],
  providers: [
    {
      provide: EXCEPTION_REGISTRY,
      useValue: ExceptionRegistry,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
  ],
})
export class RootEventsModule {}

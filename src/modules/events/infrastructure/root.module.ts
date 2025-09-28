import { Module, Provider } from '@nestjs/common';
import { EventsPublicApisProvider } from '../application/public/apis.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTypeOrmEntity } from './categories/category.entity';
import { EventTypeOrmEntity } from './events/event.entity';
import { TicketTypeOrmEntity } from './ticket-types/ticket-type.entity';
import { CategoryRepositoryProvider } from './categories/category.repository.impl';
import { GetCategoryQueryHandler } from '../application/categories/get-category/get-category.query-handler';
import { GetCategoriesQueryHandler } from '../application/categories/get-categories/get-categories.query-handler';
import { CreateCategoryCommandHandler } from '../application/categories/create-category/create-category.command-handler';
import { ArchiveCategoryCommandHandler } from '../application/categories/archive-category/archive-category.command-handler';
import { UpdateCategoryCommandHandler } from '../application/categories/update-category/update-category.command-handler';
import { CategoriesController } from '../presentation/categories/categories.controller';
import { EventRepositoryProvider } from './events/event.repository.impl';
import { CreateEventCommandHandler } from '../application/events/create-event/create-event.command.handler';
import { PublishEventCommandHandler } from '../application/events/publish-event/publish-event.command-handler';
import { RescheduleEventCommandHandler } from '../application/events/reschedule-event/reschedule-event.command-handler';
import { CancelCommandHandler } from '../application/events/cancel-event/cancel-event.command-handler';
import { GetEventQueryHandler } from '../application/events/get-event/get-event.query.handler';
import { SearchEventsQueryHandler } from '../application/events/search-event/search-event.query-handler';
import { EventRescheduledDomainEventHandler } from '../application/events/reschedule-event/event-rescheduled.domain-event.handler';
import { EventsController } from '../presentation/events/events.controller';
import { TicketTypeRepositoryProvider } from './ticket-types/ticket-type.repository.impl';
import { CreateTicketTypeCommandHandler } from '../application/ticket-types/create-ticket-type/create-ticket-type.command-handler';
import { UpdateTicketTypePriceCommandHandler } from '../application/ticket-types/update-ticket-type-price/update-ticket-type-price.command-handler';
import { GetTicketTypeQueryHandler } from '../application/ticket-types/get-ticket-type/get-ticket-type.query-handler';
import { GetTicketTypesQueryHandler } from '../application/ticket-types/get-ticket-types/get-ticket-types.query-handler';
import { TicketTypesController } from '../presentation/ticket-types/ticket-types.controller';
import { EventsIntegrationEventPublisherProvider } from '../integration/publishers/integration-event.publisher.impl';

const categoriesProviders: Provider[] = [
  CategoryRepositoryProvider,

  GetCategoryQueryHandler,
  GetCategoriesQueryHandler,

  CreateCategoryCommandHandler,
  ArchiveCategoryCommandHandler,
  UpdateCategoryCommandHandler,
];

const eventsProviders: Provider[] = [
  EventRepositoryProvider,

  CreateEventCommandHandler,
  PublishEventCommandHandler,
  RescheduleEventCommandHandler,
  CancelCommandHandler,

  GetEventQueryHandler,
  SearchEventsQueryHandler,

  EventRescheduledDomainEventHandler,
];

const ticketTypesProviders: Provider[] = [
  TicketTypeRepositoryProvider,

  CreateTicketTypeCommandHandler,
  UpdateTicketTypePriceCommandHandler,

  GetTicketTypeQueryHandler,
  GetTicketTypesQueryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryTypeOrmEntity, EventTypeOrmEntity, TicketTypeOrmEntity]),
  ],
  providers: [
    EventsPublicApisProvider,
    EventsIntegrationEventPublisherProvider,

    ...categoriesProviders,
    ...eventsProviders,
    ...ticketTypesProviders,
  ],
  controllers: [CategoriesController, EventsController, TicketTypesController],

  exports: [EventsPublicApisProvider],
})
export class RootEventsModule {}

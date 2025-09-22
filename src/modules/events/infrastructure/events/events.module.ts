import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { EventRepositoryProvider } from './event.repository.impl';
import { CreateEventCommandHandler } from '../../application/events/create-event/create-event.command.handler';
import { GetEventQueryHandler } from '../../application/events/get-event/get-event.query.handler';
import { EventsController } from '../../presentation/events/events.controller';
import { CategoriesModule } from '../categories/categories.module';
import { PublishEventCommandHandler } from '../../application/events/publish-event/publish-event.command-handler';
import { RescheduleEventCommandHandler } from '../../application/events/reschedule-event/reschedule-event.command-handler';
import { CancelCommandHandler } from '../../application/events/cancel-event/cancel-event.command-handler';
import { SearchEventsQueryHandler } from '../../application/events/search-event/search-event.query-handler';
import { EventRescheduledDomainEventHandler } from '../../application/events/reschedule-event/event-rescheduled.domain-event.handler';
import { EventsPublicApisProvider } from '../public/apis.impl';

@Module({
  imports: [TypeOrmModule.forFeature([EventTypeOrmEntity]), CategoriesModule],
  providers: [
    EventRepositoryProvider,

    CreateEventCommandHandler,
    PublishEventCommandHandler,
    RescheduleEventCommandHandler,
    CancelCommandHandler,

    GetEventQueryHandler,
    SearchEventsQueryHandler,

    EventRescheduledDomainEventHandler,
  ],
  controllers: [EventsController],
  exports: [EventRepositoryProvider],
})
export class EventsModule {}

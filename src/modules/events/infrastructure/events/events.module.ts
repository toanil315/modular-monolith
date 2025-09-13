import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { EventRepositoryProvider } from './event.repository.impl';
import { CreateEventCommandHandler } from '../../application/events/create-event/create-event.command.handler';
import { GetEventQueryHandler } from '../../application/events/get-event/get-event.query.handler';
import { EventsController } from '../../presentation/events/events.controller';
import { CategoriesModule } from '../categories/categories.module';
import { PublishEventCommandHandler } from '../../application/events/publish-event/publish-event.command-handler';
import { RescheduleEventCommandHandler } from '../../application/events/reschedule-event/reschedule-event.command-handler';
import { CancelCommandHandler } from '../../application/events/cancel-event/cancel-event.command-handler';
import { SearchEventsQueryHandler } from '../../application/events/search-event/search-event.query-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTypeOrmEntity], EVENTS_CONNECTION_NAME),
    CategoriesModule,
  ],
  providers: [
    EventRepositoryProvider,

    CreateEventCommandHandler,
    PublishEventCommandHandler,
    RescheduleEventCommandHandler,
    CancelCommandHandler,

    GetEventQueryHandler,
    SearchEventsQueryHandler,
  ],
  controllers: [EventsController],
  exports: [EventRepositoryProvider],
})
export class EventsModule {}

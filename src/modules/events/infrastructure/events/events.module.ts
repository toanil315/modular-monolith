import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeOrmEntity } from './event.entity';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { EventRepositoryProvider } from './event.repository.impl';
import { CreateEventCommandHandler } from '../../application/events/create-event/create-event.command.handler';
import { GetEventQueryHandler } from '../../application/events/get-event/get-event.query.handler';
import { EventsController } from '../../presentation/events/events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTypeOrmEntity], EVENTS_CONNECTION_NAME),
  ],
  providers: [
    EventRepositoryProvider,
    CreateEventCommandHandler,
    GetEventQueryHandler,
  ],
  controllers: [EventsController],
})
export class EventsModule {}

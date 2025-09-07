import { Module } from '@nestjs/common';
import { EventsDatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { EVENTS_CONNECTION_NAME } from './database/datasource';
import { EventsService } from './events/service';
import { EventsController } from './events/controller';

@Module({
  imports: [
    EventsDatabaseModule,
    TypeOrmModule.forFeature([Event], EVENTS_CONNECTION_NAME),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}

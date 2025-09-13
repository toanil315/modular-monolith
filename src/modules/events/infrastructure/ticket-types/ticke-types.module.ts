import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { EVENTS_CONNECTION_NAME } from '../database/datasource';
import { TicketTypeRepositoryProvider } from './ticket-type.repository.impl';
import { EventsModule } from '../events/events.module';
import { TicketTypesController } from '../../presentation/ticket-types/ticket-types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketTypeOrmEntity], EVENTS_CONNECTION_NAME),
    EventsModule,
  ],
  providers: [TicketTypeRepositoryProvider],
  controllers: [TicketTypesController],
})
export class TicketTypesModule {}

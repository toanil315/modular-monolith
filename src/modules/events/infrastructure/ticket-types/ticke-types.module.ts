import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTypeOrmEntity } from './ticket-type.entity';
import { TicketTypeRepositoryProvider } from './ticket-type.repository.impl';
import { EventsModule } from '../events/events.module';
import { TicketTypesController } from '../../presentation/ticket-types/ticket-types.controller';
import { CreateTicketTypeCommandHandler } from '../../application/ticket-types/create-ticket-type/create-ticket-type.command-handler';
import { UpdateTicketTypePriceCommandHandler } from '../../application/ticket-types/update-ticket-type-price/update-ticket-type-price.command-handler';
import { GetTicketTypeQueryHandler } from '../../application/ticket-types/get-ticket-type/get-ticket-type.query-handler';
import { GetTicketTypesQueryHandler } from '../../application/ticket-types/get-ticket-types/get-ticket-types.query-handler';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTypeOrmEntity]), EventsModule],
  providers: [
    TicketTypeRepositoryProvider,

    CreateTicketTypeCommandHandler,
    UpdateTicketTypePriceCommandHandler,

    GetTicketTypeQueryHandler,
    GetTicketTypesQueryHandler,
  ],
  controllers: [TicketTypesController],
})
export class TicketTypesModule {}

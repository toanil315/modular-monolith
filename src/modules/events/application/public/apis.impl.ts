import { Injectable, Provider } from '@nestjs/common';
import {
  CancelEventResponse,
  EVENTS_PUBLIC_APIS_TOKEN,
  EventsPublicApis,
  GetTicketTypeByIdResponse,
} from '../../public/apis';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetTicketTypeQuery } from '../ticket-types/get-ticket-type/get-ticket-type.query';
import { CancelEventCommand } from '../events/cancel-event/cancel-event.command';

@Injectable()
export class EventsPublicApisImpl implements EventsPublicApis {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async getTicketTypeById(ticketTypeId: string) {
    const result = await this.queryBus.execute(new GetTicketTypeQuery({ id: ticketTypeId }));

    if (!result.isSuccess) {
      return null;
    }

    const ticketType = result.value;
    return new GetTicketTypeByIdResponse(
      ticketType.id,
      ticketType.eventId,
      ticketType.name,
      ticketType.price,
      ticketType.currency,
      ticketType.quantity,
    );
  }

  async cancelEvent(eventId: string) {
    const result = await this.commandBus.execute(new CancelEventCommand({ id: eventId }));

    if (!result.isSuccess) {
      return new CancelEventResponse(eventId, false);
    }

    return new CancelEventResponse(eventId, true);
  }
}

export const EventsPublicApisProvider: Provider = {
  provide: EVENTS_PUBLIC_APIS_TOKEN,
  useClass: EventsPublicApisImpl,
};

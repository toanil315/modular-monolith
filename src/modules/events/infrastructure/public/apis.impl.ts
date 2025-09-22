import { Injectable, Provider } from '@nestjs/common';
import {
  EVENTS_PUBLIC_APIS_TOKEN,
  EventsPublicApis,
  GetTicketTypeByIdResponse,
} from '../../public/apis';
import { QueryBus } from '@nestjs/cqrs';
import { GetTicketTypeQuery } from '../../application/ticket-types/get-ticket-type/get-ticket-type.query';

@Injectable()
export class EventsPublicApisImpl implements EventsPublicApis {
  constructor(private queryBus: QueryBus) {}

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
}

export const EventsPublicApisProvider: Provider = {
  provide: EVENTS_PUBLIC_APIS_TOKEN,
  useClass: EventsPublicApisImpl,
};

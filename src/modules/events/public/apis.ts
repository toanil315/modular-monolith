export const EVENTS_PUBLIC_APIS_TOKEN = 'EVENTS_PUBLIC_APIS_TOKEN';

export interface EventsPublicApis {
  getTicketTypeById: (ticketTypeId: string) => Promise<GetTicketTypeByIdResponse | null>;
  cancelEvent: (eventId: string) => Promise<CancelEventResponse>;
}

export class GetTicketTypeByIdResponse {
  constructor(
    public id: string,
    public eventId: string,
    public name: string,
    public price: number,
    public currency: string,
    public quantity: number,
  ) {}
}

export class CancelEventResponse {
  constructor(
    public id: string,
    public success: boolean,
  ) {}
}

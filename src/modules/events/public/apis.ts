export const EVENTS_PUBLIC_APIS_TOKEN = 'EVENTS_PUBLIC_APIS_TOKEN';

export interface EventsPublicApis {
  getTicketTypeById: (ticketTypeId: string) => Promise<GetTicketTypeByIdResponse | null>;
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

import { IntegrationEvent } from 'src/modules/common/application/messagings/integration-event';

export namespace TicketTypeIntegrationEvent {
  export class TicketTypeCreatedIntegrationEvent extends IntegrationEvent {
    static readonly type = 'IntegrationEvent.TicketTypeCreated';

    constructor(
      public readonly ticketTypeId: string,
      public readonly eventId: string,
      public readonly name: string,
      public readonly price: number,
      public readonly currency: string,
      public readonly quantity: number,
    ) {
      super(TicketTypeCreatedIntegrationEvent.type);
    }
  }
}

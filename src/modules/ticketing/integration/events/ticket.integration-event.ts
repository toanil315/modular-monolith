import { IntegrationEvent } from 'src/modules/common/application/messagings/integration-event';

export namespace TicketIntegrationEvent {
  export class TicketCreatedIntegrationEvent extends IntegrationEvent {
    static readonly type = 'IntegrationEvent.TicketCreated';

    constructor(
      public readonly ticketId: string,
      public readonly customerId: string,
      public readonly orderId: string,
      public readonly eventId: string,
      public readonly ticketTypeId: string,
      public readonly code: string,
      public readonly createdAt: Date,
      public readonly archived: boolean,
    ) {
      super(TicketCreatedIntegrationEvent.type);
    }
  }
}

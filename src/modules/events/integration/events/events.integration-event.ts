import { IntegrationEvent } from 'src/modules/common/application/messagings/integration-event';
import { EventStatus } from '../../domain/events/event-status';
import { TicketType } from '../../domain/ticket-types/ticket-type';

export namespace EventIntegrationEvent {
  export class EventPublishedIntegrationEvent extends IntegrationEvent {
    static readonly type = 'IntegrationEvent.EventPublished';

    constructor(
      public eventId: string,
      public categoryId: string,
      public title: string,
      public description: string,
      public location: string,
      public status: EventStatus,
      public startsAt: number,
      public endsAt: number,
      public ticketTypes: TicketType[] = [],
    ) {
      super(EventPublishedIntegrationEvent.type);
    }
  }
}

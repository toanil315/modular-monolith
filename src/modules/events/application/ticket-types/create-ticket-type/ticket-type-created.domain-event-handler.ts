import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { TicketTypeDomainEvent } from 'src/modules/events/domain/ticket-types/ticket-type.domain-event';
import {
  EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  EventsIntegrationEventsPublisher,
} from '../../abstractions/integration-event.publisher';
import { GetTicketTypeQuery } from '../get-ticket-type/get-ticket-type.query';

@Injectable()
@EventsHandler(TicketTypeDomainEvent.TicketTypeCreatedDomainEvent)
export class TicketTypeCreatedDomainEventHandler
  implements IEventHandler<TicketTypeDomainEvent.TicketTypeCreatedDomainEvent>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private readonly eventsIntegrationEventPublisher: EventsIntegrationEventsPublisher,
  ) {}

  async handle({ ticketTypeId }: TicketTypeDomainEvent.TicketTypeCreatedDomainEvent) {
    const result = await this.queryBus.execute(new GetTicketTypeQuery({ id: ticketTypeId }));

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }

    await this.eventsIntegrationEventPublisher.publishTicketTypeCreated(result.value);
  }
}

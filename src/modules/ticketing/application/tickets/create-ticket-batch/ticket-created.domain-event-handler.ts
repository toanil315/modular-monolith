import { Inject } from '@nestjs/common';
import { BaseEventHandler } from 'src/modules/common/application/event-bus/event-handler.base';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import {
  OUTBOX_CONSUMER_REPOSITORY_TOKEN,
  OutboxConsumerRepository,
} from 'src/modules/common/application/messagings/outbox-consumer.repository';
import { TicketDomainEvent } from 'src/modules/ticketing/domain/tickets/ticket.domain-event';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../abstractions/integration-event.pulisher';
import {
  TICKET_REPOSITORY_TOKEN,
  TicketRepository,
} from 'src/modules/ticketing/domain/tickets/ticket.repository';
import { TicketErrors } from 'src/modules/ticketing/domain/tickets/ticket.error';

export class TicketCreatedDomainEventHandler extends BaseEventHandler {
  constructor(
    @Inject(OUTBOX_CONSUMER_REPOSITORY_TOKEN) outboxConsumerRepository: OutboxConsumerRepository,
    @Inject(INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private readonly integrationEventPublisher: IntegrationEventsPublisher,
    @Inject(TICKET_REPOSITORY_TOKEN) private readonly ticketRepository: TicketRepository,
  ) {
    super(outboxConsumerRepository, 'ticketing.application.tickets.create-ticket-batch');
  }

  @EventHandler(TicketDomainEvent.TicketCreatedDomainEvent)
  async handle({ ticketId }: TicketDomainEvent.TicketCreatedDomainEvent): Promise<void> {
    const ticket = await this.ticketRepository.getByIdOrCode(ticketId);

    if (!ticket) {
      throw new Error(TicketErrors.TicketNotFoundById(ticketId).message);
    }

    await this.integrationEventPublisher.publishTicketCreated(ticket);
  }
}

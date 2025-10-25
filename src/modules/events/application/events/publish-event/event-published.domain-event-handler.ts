import { Inject, Injectable } from '@nestjs/common';
import { BaseEventHandler } from 'src/modules/common/application/event-bus/event-handler.base';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import {
  OUTBOX_CONSUMER_REPOSITORY_TOKEN,
  OutboxConsumerRepository,
} from 'src/modules/common/application/messagings/outbox-consumer.repository';
import { EventDomainEvent } from 'src/modules/events/domain/events/event.domain-event';
import {
  EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  EventsIntegrationEventsPublisher,
} from '../../abstractions/integration-event.publisher';
import { QueryBus } from '@nestjs/cqrs';
import { GetEventQuery } from '../get-event/get-event.query';

@Injectable()
export class EventPublishedDomainEventHandler extends BaseEventHandler {
  constructor(
    @Inject(OUTBOX_CONSUMER_REPOSITORY_TOKEN) outboxConsumerRepository: OutboxConsumerRepository,
    @Inject(EVENTS_INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private integrationEventPublisher: EventsIntegrationEventsPublisher,
    private readonly queryBus: QueryBus,
  ) {
    super(outboxConsumerRepository, 'events.application.events.publish-event');
  }

  @EventHandler(EventDomainEvent.EventPublishedDomainEvent)
  async handle({ eventId }: EventDomainEvent.EventPublishedDomainEvent): Promise<void> {
    const eventResult = await this.queryBus.execute(new GetEventQuery({ eventId }));

    if (!eventResult.isSuccess) {
      throw new Error(eventResult.businessError?.message);
    }

    this.integrationEventPublisher.publishEventPublished(eventResult.value);
  }
}

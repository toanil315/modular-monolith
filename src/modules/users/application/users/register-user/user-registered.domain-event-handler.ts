import { Inject, Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserDomainEvent } from 'src/modules/users/domain/users/user.domain-event';
import { GetUserQuery } from '../get-user/get-user.query';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../abstractions/integration-event.publisher';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';
import { BaseEventHandler } from 'src/modules/common/application/event-bus/event-handler.base';
import {
  OUTBOX_CONSUMER_REPOSITORY_TOKEN,
  OutboxConsumerRepository,
} from 'src/modules/common/application/messagings/outbox-consumer.repository';

@Injectable()
export class UserRegisteredDomainEventHandler extends BaseEventHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private integrationEventsPublisher: IntegrationEventsPublisher,
    @Inject(OUTBOX_CONSUMER_REPOSITORY_TOKEN)
    outboxConsumerRepository: OutboxConsumerRepository,
  ) {
    super(outboxConsumerRepository, 'users.application.users');
  }

  @EventHandler(UserDomainEvent.UserRegisteredDomainEvent)
  async handle({ userId }: UserDomainEvent.UserRegisteredDomainEvent) {
    const result = await this.queryBus.execute(new GetUserQuery({ id: userId }));

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }

    await this.integrationEventsPublisher.publishUserRegistered(result.value);
  }
}

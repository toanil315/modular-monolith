import { Inject, Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserDomainEvent } from 'src/modules/users/domain/users/user.domain-event';
import { GetUserQuery } from '../get-user/get-user.query';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../abstractions/integration-event.publisher';
import { EventHandler } from 'src/modules/common/application/event-bus/event-handler.decorator';

@Injectable()
export class UserRegisteredDomainEventHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private integrationEventsPublisher: IntegrationEventsPublisher,
  ) {}

  @EventHandler(UserDomainEvent.UserRegisteredDomainEvent)
  async handle({ userId }: UserDomainEvent.UserRegisteredDomainEvent) {
    const result = await this.queryBus.execute(new GetUserQuery({ id: userId }));

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }

    await this.integrationEventsPublisher.publishUserRegistered(result.value);
  }
}

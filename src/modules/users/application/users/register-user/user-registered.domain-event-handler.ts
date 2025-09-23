import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { UserDomainEvent } from 'src/modules/users/domain/users/user.domain-event';
import { GetUserQuery } from '../get-user/get-user.query';
import {
  INTEGRATION_EVENTS_PUBLISHER_TOKEN,
  IntegrationEventsPublisher,
} from '../../abstractions/integration-event.publisher';

@Injectable()
@EventsHandler(UserDomainEvent.UserRegisteredDomainEvent)
export class UserRegisteredDomainEventHandler
  implements IEventHandler<UserDomainEvent.UserRegisteredDomainEvent>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(INTEGRATION_EVENTS_PUBLISHER_TOKEN)
    private integrationEventsPublisher: IntegrationEventsPublisher,
  ) {}

  async handle({ userId }: UserDomainEvent.UserRegisteredDomainEvent) {
    const result = await this.queryBus.execute(new GetUserQuery({ id: userId }));

    if (!result.isSuccess) {
      throw new Error(result.businessError?.message);
    }

    await this.integrationEventsPublisher.publishUserRegistered(result.value);
  }
}

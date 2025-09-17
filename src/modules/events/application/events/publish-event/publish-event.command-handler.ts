import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishEventCommand } from './publish-event.command';
import { Inject } from '@nestjs/common';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventErrors } from 'src/modules/events/domain/events/event.exception';

@CommandHandler(PublishEventCommand)
export class PublishEventCommandHandler
  implements ICommandHandler<PublishEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: PublishEventCommand): Promise<void> {
    const event = await this.eventRepository.getById(props.id);

    if (!event) {
      throw new EventErrors.EventNotFoundError(props.id);
    }

    event.publish();
    await this.eventRepository.save(event);
  }
}

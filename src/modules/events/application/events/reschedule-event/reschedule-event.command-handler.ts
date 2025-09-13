import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventExceptions } from 'src/modules/events/domain/events/event.exception';
import { RescheduleEventCommand } from './reschedule-event.command';

@CommandHandler(RescheduleEventCommand)
export class RescheduleEventCommandHandler
  implements ICommandHandler<RescheduleEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: RescheduleEventCommand): Promise<void> {
    const event = await this.eventRepository.getById(props.id);

    if (!event) {
      throw new EventExceptions.EventNotFoundException(props.id);
    }

    event.reschedule(props.startsAt, props.endsAt);
    await this.eventRepository.save(event);
  }
}

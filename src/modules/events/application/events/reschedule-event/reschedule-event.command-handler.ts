import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventErrors } from 'src/modules/events/domain/events/event.exception';
import { RescheduleEventCommand } from './reschedule-event.command';
import { Result } from 'src/modules/common/domain/result';

@CommandHandler(RescheduleEventCommand)
export class RescheduleEventCommandHandler
  implements ICommandHandler<RescheduleEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: RescheduleEventCommand) {
    const event = await this.eventRepository.getById(props.id);

    if (!event) {
      return Result.failure(EventErrors.EventNotFoundError(props.id));
    }

    const result = event.reschedule(props.startsAt, props.endsAt);

    if (!result.isSuccess) {
      return result;
    }

    await this.eventRepository.save(result.value);
    return result;
  }
}

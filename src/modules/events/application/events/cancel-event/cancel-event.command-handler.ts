import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { CancelEventCommand } from './cancel-event.command';
import { EventErrors } from 'src/modules/events/domain/events/event.error';
import { Result } from 'src/modules/common/domain/result';

@CommandHandler(CancelEventCommand)
export class CancelCommandHandler
  implements ICommandHandler<CancelEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
  ) {}

  async execute({ props }: CancelEventCommand) {
    const event = await this.eventRepository.getById(props.id);

    if (!event) {
      return Result.failure(EventErrors.EventNotFoundError(props.id));
    }

    const result = event.cancel();

    if (!result.isSuccess) {
      return result;
    }

    await this.eventRepository.save(result.value);
    return result;
  }
}

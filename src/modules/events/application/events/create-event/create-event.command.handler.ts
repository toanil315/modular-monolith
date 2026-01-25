import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { CreateEventCommand } from './create-event.command';
import { Event } from 'src/modules/events/domain/events/event';
import {
  CATEGORY_REPOSITORY_TOKEN,
  CategoryRepository,
} from 'src/modules/events/domain/categories/category.repository';
import { EventErrors } from 'src/modules/events/domain/events/event.error';
import { Result } from 'src/modules/common/domain/result';
import { CategoryErrors } from 'src/modules/events/domain/categories/category.error';
import { PolicyService } from 'src/modules/authz/policy.service';

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN) private eventRepository: EventRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private categoryToken: CategoryRepository,
    private readonly policyService: PolicyService,
  ) {}

  async execute({ props }: CreateEventCommand) {
    if (props.startsAt < Date.now()) {
      return Result.failure(EventErrors.EventStartDateInPastError);
    }

    const category = await this.categoryToken.getById(props.categoryId);

    if (!category) {
      return Result.failure(CategoryErrors.CategoryNotFoundError(props.categoryId));
    }

    const result = Event.create(
      category,
      props.title,
      props.description,
      props.location,
      props.startsAt,
      props.endsAt,
    );

    if (!result.isSuccess) {
      return result;
    }

    await this.eventRepository.save(result.value);

    // Write ownership relationship to SpiceDB
    await this.policyService.writeRelationship({
      resourceType: 'event',
      resourceId: result.value.id,
      relation: 'owner',
      subjectType: 'user',
      subjectId: props.userId,
    });

    // Write public view relationship to SpiceDB
    await this.policyService.writeRelationship({
      resourceType: 'event',
      resourceId: result.value.id,
      relation: 'viewer',
      subjectType: 'user',
      subjectId: '*',
    });

    return result;
  }
}

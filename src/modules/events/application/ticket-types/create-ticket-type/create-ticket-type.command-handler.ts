import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTicketTypeCommand } from './create-ticket-type.command';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { EVENT_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/events/event.repository.impl';
import { EventRepository } from 'src/modules/events/domain/events/event.repository';
import { EventErrors } from 'src/modules/events/domain/events/event.error';
import { TicketType } from 'src/modules/events/domain/ticket-types/ticket-type';
import { Result } from 'src/modules/common/domain/result';
import { PolicyService } from 'src/modules/authz/policy.service';

@CommandHandler(CreateTicketTypeCommand)
export class CreateTicketTypeCommandHandler implements ICommandHandler<CreateTicketTypeCommand> {
  constructor(
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private ticketTypeRepository: TicketTypeRepository,

    @Inject(EVENT_REPOSITORY_TOKEN)
    private eventRepository: EventRepository,

    private readonly policyService: PolicyService,
  ) {}

  async execute({ props }: CreateTicketTypeCommand) {
    const event = await this.eventRepository.getById(props.eventId);

    if (!event) {
      return Result.failure(EventErrors.EventNotFoundError(props.eventId));
    }

    const result = TicketType.create(
      event,
      props.name,
      props.price,
      props.currency,
      props.quantity,
    );

    await this.ticketTypeRepository.save(result.value);

    await this.policyService.writeRelationship({
      resourceType: 'ticket_type',
      resourceId: result.value.id,
      relation: 'parent',
      subjectType: 'event',
      subjectId: event.id,
    });

    return result;
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketTypeQuery } from './get-ticket-type.query';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { Result } from 'src/modules/common/domain/result';
import { TicketTypeErrors } from 'src/modules/events/domain/ticket-types/ticket-type.error';

@QueryHandler(GetTicketTypeQuery)
export class GetTicketTypeQueryHandler
  implements IQueryHandler<GetTicketTypeQuery>
{
  constructor(
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private ticketTypeRepository: TicketTypeRepository,
  ) {}

  async execute({ props }: GetTicketTypeQuery) {
    const ticketType = await this.ticketTypeRepository.getById(props.id);

    if (!ticketType) {
      return Result.failure(TicketTypeErrors.TicketTypeNotFoundError(props.id));
    }

    return Result.success(ticketType);
  }
}

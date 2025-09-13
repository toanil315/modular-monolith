import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketTypeQuery } from './get-ticket-type.query';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { TicketTypeExceptions } from 'src/modules/events/domain/ticket-types/ticket-type.exception';

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
      throw new TicketTypeExceptions.TicketTypeNotFoundException(props.id);
    }

    return ticketType;
  }
}

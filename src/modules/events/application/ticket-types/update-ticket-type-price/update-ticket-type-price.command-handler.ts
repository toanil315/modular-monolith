import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTicketTypePriceCommand } from './update-ticket-type-price.command';
import { Inject } from '@nestjs/common';
import { TICKET_TYPE_REPOSITORY_TOKEN } from 'src/modules/events/infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketTypeRepository } from 'src/modules/events/domain/ticket-types/ticket-type.repository';
import { TicketTypeExceptions } from 'src/modules/events/domain/ticket-types/ticket-type.exception';

@CommandHandler(UpdateTicketTypePriceCommand)
export class UpdateTicketTypePriceCommandHandler
  implements ICommandHandler<UpdateTicketTypePriceCommand>
{
  constructor(
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private ticketTypeRepository: TicketTypeRepository,
  ) {}

  async execute({ props }: UpdateTicketTypePriceCommand): Promise<void> {
    const ticketType = await this.ticketTypeRepository.getById(props.id);

    if (!ticketType) {
      throw new TicketTypeExceptions.TicketTypeNotFoundException(props.id);
    }

    ticketType.updatePrice(props.price);
    await this.ticketTypeRepository.save(ticketType);
  }
}

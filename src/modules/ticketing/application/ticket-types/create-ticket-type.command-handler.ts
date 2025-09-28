import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTicketTypeCommand } from './create-ticket-type.command';
import { Inject } from '@nestjs/common';
import {
  TICKET_TYPE_REPOSITORY_TOKEN,
  TicketTypeRepository,
} from '../../domain/ticket-types/ticket-type.repository';
import { Result } from 'src/modules/common/domain/result';
import { TicketType } from '../../domain/ticket-types/ticket-type';

@CommandHandler(CreateTicketTypeCommand)
export class CreateTicketTypeCommandHandler implements ICommandHandler<CreateTicketTypeCommand> {
  constructor(
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private readonly ticketTypeRepository: TicketTypeRepository,
  ) {}

  async execute({ props }: CreateTicketTypeCommand): Promise<Result<TicketType>> {
    const result = TicketType.create(
      props.id,
      props.eventId,
      props.name,
      props.price,
      props.currency,
      props.quantity,
      props.quantity,
    );

    if (!result.isSuccess) {
      return result;
    }

    await this.ticketTypeRepository.save(result.value);
    return result;
  }
}

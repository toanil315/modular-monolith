import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemFromCartCommand } from './remove-item-from-cart.command';
import { Inject } from '@nestjs/common';
import { EVENTS_PUBLIC_APIS_TOKEN, EventsPublicApis } from 'src/modules/events/public/apis';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from 'src/modules/ticketing/domain/customers/customer.repository';
import { CartService } from '../cart.service';
import { Result } from 'src/modules/common/domain/result';
import { CustomerErrors } from 'src/modules/ticketing/domain/customers/customer.error';
import { TicketTypeErrors } from 'src/modules/ticketing/domain/ticket-types/ticket-type.error';

@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartCommandHandler
  implements ICommandHandler<RemoveItemFromCartCommand>
{
  constructor(
    @Inject(EVENTS_PUBLIC_APIS_TOKEN) private readonly eventsPublicApi: EventsPublicApis,
    @Inject(CUSTOMER_REPOSITORY_TOKEN) private readonly customerRepository: CustomerRepository,
    private readonly cartService: CartService,
  ) {}

  async execute({ props }: RemoveItemFromCartCommand) {
    const customer = await this.customerRepository.getById(props.customerId);

    if (!customer) {
      return Result.failure(CustomerErrors.CustomerNotFoundError(props.customerId));
    }

    const ticketType = await this.eventsPublicApi.getTicketTypeById(props.ticketTypeId);

    if (!ticketType) {
      return Result.failure(TicketTypeErrors.TicketTypeNotFoundError(props.ticketTypeId));
    }

    const cart = await this.cartService.removeItem(props.customerId, props.ticketTypeId);

    return Result.success(cart);
  }
}

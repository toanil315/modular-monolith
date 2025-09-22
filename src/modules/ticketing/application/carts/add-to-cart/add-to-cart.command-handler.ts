import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddToCartCommand } from './add-to-cart.command';
import { Inject } from '@nestjs/common';
import { EVENTS_PUBLIC_APIS_TOKEN, EventsPublicApis } from 'src/modules/events/public/apis';
import { USERS_PUBLIC_APIS_TOKEN, UsersPublicApis } from 'src/modules/users/public/apis';
import { Result } from 'src/modules/common/domain/result';
import { CustomerErrors } from 'src/modules/ticketing/domain/customers/customer.error';
import { TicketTypeErrors } from 'src/modules/ticketing/domain/ticket-types/ticket-type.error';
import { CartItem } from 'src/modules/ticketing/domain/carts/cart-item';
import { CartService } from '../cart.service';

@CommandHandler(AddToCartCommand)
export class AddToCartCommandHandler implements ICommandHandler<AddToCartCommand> {
  constructor(
    @Inject(EVENTS_PUBLIC_APIS_TOKEN) private readonly eventsPublicApis: EventsPublicApis,
    @Inject(USERS_PUBLIC_APIS_TOKEN) private readonly usersPublicApis: UsersPublicApis,
    private readonly cartService: CartService,
  ) {}

  async execute({ props }: AddToCartCommand) {
    const customer = await this.usersPublicApis.getUserById(props.customerId);

    if (!customer) {
      return Result.failure(CustomerErrors.CustomerNotFoundError(props.customerId));
    }

    const ticketType = await this.eventsPublicApis.getTicketTypeById(props.ticketTypeId);

    if (!ticketType) {
      return Result.failure(TicketTypeErrors.TicketTypeNotFoundError(props.ticketTypeId));
    }

    const cartItem = new CartItem(props.ticketTypeId, props.quantity);
    const cart = await this.cartService.addItem(props.customerId, cartItem);
    return Result.success(cart);
  }
}

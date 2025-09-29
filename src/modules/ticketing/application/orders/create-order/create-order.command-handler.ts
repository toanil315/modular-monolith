import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import {
  ORDER_REPOSITORY_TOKEN,
  OrderRepository,
} from 'src/modules/ticketing/domain/orders/order.repository';
import { Result } from 'src/modules/common/domain/result';
import { Order } from 'src/modules/ticketing/domain/orders/order';
import {
  CUSTOMER_REPOSITORY_TOKEN,
  CustomerRepository,
} from 'src/modules/ticketing/domain/customers/customer.repository';
import { CustomerErrors } from 'src/modules/ticketing/domain/customers/customer.error';
import { CartService } from '../../carts/cart.service';
import { CartError } from 'src/modules/ticketing/domain/carts/cart.error';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  TICKET_TYPE_REPOSITORY_TOKEN,
  TicketTypeRepository,
} from 'src/modules/ticketing/domain/ticket-types/ticket-type.repository';
import { TicketErrors } from 'src/modules/ticketing/domain/tickets/ticket.error';
import { BusinessError } from 'src/modules/common/domain/error';
import { PaymentService } from '../../payments/payment.service';
import { Payment } from 'src/modules/ticketing/domain/payments/payment';
import {
  PAYMENT_REPOSITORY_TOKEN,
  PaymentRepository,
} from 'src/modules/ticketing/domain/payments/payment.repository';

@Injectable()
@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN) private readonly orderRepository: OrderRepository,
    @Inject(CUSTOMER_REPOSITORY_TOKEN) private readonly customerRepository: CustomerRepository,
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private readonly ticketTypeRepository: TicketTypeRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(PAYMENT_REPOSITORY_TOKEN) private readonly paymentRepository: PaymentRepository,
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({ props }: CreateOrderCommand): Promise<Result<Order>> {
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const orderRepo = this.orderRepository.withManager(manager);
        const ticketTypeRepo = this.ticketTypeRepository.withManager(manager);
        const paymentRepo = this.paymentRepository.withManager(manager);

        const customer = await this.customerRepository.getById(props.customerId);

        if (!customer) {
          throw CustomerErrors.CustomerNotFoundError(props.customerId);
        }

        const orderResult = Order.create(customer);
        const order = orderResult.value;

        const cart = await this.cartService.get(props.customerId);

        if (!cart.items.length) {
          throw CartError.CartEmptyError;
        }

        for (const item of cart.items) {
          const ticketType = await ticketTypeRepo.getWithLock(item.ticketTypeId);

          if (!ticketType) {
            throw TicketErrors.TicketNotFoundById(item.ticketTypeId);
          }

          const ticketTypeResult = ticketType.updateAvailableQuantity(item.quantity);

          if (!ticketTypeResult.isSuccess) {
            throw ticketTypeResult.businessError!;
          }

          await ticketTypeRepo.save(ticketTypeResult.value);
          order.addItem(ticketType, item.quantity);
        }

        await orderRepo.save(order);

        const paymentResponse = await this.paymentService.charge(order.totalPrice, order.currency!);

        const payment = Payment.create(
          order,
          paymentResponse.id,
          paymentResponse.amount,
          paymentResponse.currency,
        );

        await paymentRepo.save(payment.value);
        await this.cartService.clear(props.customerId);

        return Result.success(order);
      });

      return result;
    } catch (error) {
      if (error instanceof BusinessError) return Result.failure(error);
      throw error;
    }
  }
}

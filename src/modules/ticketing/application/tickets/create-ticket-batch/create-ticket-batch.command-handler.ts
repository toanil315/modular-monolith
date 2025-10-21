import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTicketBatchCommand } from './create-ticket-batch.command';
import { Inject } from '@nestjs/common';
import {
  TICKET_REPOSITORY_TOKEN,
  TicketRepository,
} from 'src/modules/ticketing/domain/tickets/ticket.repository';
import {
  ORDER_REPOSITORY_TOKEN,
  OrderRepository,
} from 'src/modules/ticketing/domain/orders/order.repository';
import { Result } from 'src/modules/common/domain/result';
import { OrderErrors } from 'src/modules/ticketing/domain/orders/order.error';
import { Ticket } from 'src/modules/ticketing/domain/tickets/ticket';
import {
  TICKET_TYPE_REPOSITORY_TOKEN,
  TicketTypeRepository,
} from 'src/modules/ticketing/domain/ticket-types/ticket-type.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TicketTypeError } from 'src/modules/ticketing/domain/ticket-types/ticket-type.error';

@CommandHandler(CreateTicketBatchCommand)
export class CreateTicketBatchCommandHandler implements ICommandHandler<CreateTicketBatchCommand> {
  constructor(
    @Inject(TICKET_REPOSITORY_TOKEN) private readonly ticketRepository: TicketRepository,
    @Inject(ORDER_REPOSITORY_TOKEN) private readonly orderRepository: OrderRepository,
    @Inject(TICKET_TYPE_REPOSITORY_TOKEN)
    private readonly ticketTypeRepository: TicketTypeRepository,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async execute({ props }: CreateTicketBatchCommand) {
    return this.entityManager.transaction(async (manager) => {
      const ticketRepository = this.ticketRepository.withManager(manager);
      const orderRepository = this.orderRepository.withManager(manager);

      const order = await orderRepository.getById(props.orderId);

      if (!order) {
        return Result.failure(OrderErrors.OrderNotFoundError(props.orderId));
      }

      const orderIssueTicketsResult = order.issueTickets();

      if (!orderIssueTicketsResult.isSuccess) {
        return Result.failure(orderIssueTicketsResult.businessError!);
      }

      let tickets: Ticket[] = [];

      for (const orderItem of order.orderItems) {
        const ticketType = await this.ticketTypeRepository.getById(orderItem.ticketTypeId);

        if (!ticketType) {
          return Result.failure(TicketTypeError.TicketTypeNotFoundError(orderItem.ticketTypeId));
        }

        const ticketResult = Ticket.create(order, ticketType);

        if (!ticketResult.isSuccess) {
          return Result.failure(ticketResult.businessError!);
        }

        tickets.push(ticketResult.value);
      }

      await ticketRepository.saveBatch(tickets);
      await orderRepository.save(orderIssueTicketsResult.value);

      return Result.success(tickets);
    });
  }
}

import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../common/domain/entity';
import { Result } from '../../../common/domain/result';
import { OrderDomainEvent } from './order.domain-event';
import { OrderItem } from './order-item';
import { Customer } from '../customers/customer';
import { OrderErrors } from './order.error';
import { TicketType } from '../ticket-types/ticket-type';

export enum OrderStatus {
  Pending = 0,
  Paid = 1,
  Refunded = 2,
  Canceled = 3,
}

export class Order extends Entity {
  constructor(
    public id: string,
    public customerId: string,
    public status: OrderStatus,
    public totalPrice: number,
    public currency: string | null,
    public ticketsIssued: boolean,
    public createdAt: Date,
    public orderItems: OrderItem[],
  ) {
    super();
  }

  static create(customer: Customer): Result<Order> {
    const order = new Order(
      uuidV4(),
      customer.id,
      OrderStatus.Pending,
      0,
      null,
      false,
      new Date(),
      [],
    );
    order.raise(new OrderDomainEvent.OrderCreatedDomainEvent(order.id));
    return Result.success(order);
  }

  addItem(ticketType: TicketType, quantity: number): void {
    const orderItem = OrderItem.create(
      this.id,
      ticketType.id,
      quantity,
      ticketType.price,
      ticketType.currency,
    );
    this.orderItems.push(orderItem);
    this.totalPrice = this.orderItems.reduce((sum, item) => sum + item.price, 0);
    this.currency = ticketType.currency;
  }

  issueTickets(): Result<Order> {
    if (this.ticketsIssued) {
      return Result.failure(OrderErrors.TicketsAlreadyIssued);
    }

    this.ticketsIssued = true;

    this.raise(new OrderDomainEvent.OrderTicketsIssuedDomainEvent(this.id));

    return Result.success(this);
  }
}

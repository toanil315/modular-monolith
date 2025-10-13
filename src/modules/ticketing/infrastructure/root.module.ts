import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './customers/customer.entity';
import { CartService } from '../application/carts/cart.service';
import { AddToCartCommandHandler } from '../application/carts/add-to-cart/add-to-cart.command-handler';
import { CustomerRepositoryProvider } from './customers/customer.repository.impl';
import { CreateCustomerCommandHandler } from '../application/customers/create-customer/create-customer.command-handler';
import { CartsController } from '../presentation/carts/carts.controller';
import { UserRegisteredIntegrationEventHandler } from '../integration/handlers/user-registered.integration-event-handler';
import { OrderItemTypeOrmEntity } from './orders/order-item.entity';
import { OrderTypeOrmEntity } from './orders/order.entity';
import { PaymentTypeOrmEntity } from './payments/payment.entity';
import { TicketTypeTypeOrmEntity } from './ticket-types/ticket-type.entity';
import { TicketTypeOrmEntity } from './tickets/ticket.entity';
import { OrderRepositoryProvider } from './orders/order.repository.impl';
import { PaymentRepositoryProvider } from './payments/payment.repository.impl';
import { TicketTypeRepositoryProvider } from './ticket-types/ticket-type.repository.impl';
import { TicketRepositoryProvider } from './tickets/ticket.repository.impl';
import { CreateTicketTypeCommandHandler } from '../application/ticket-types/create-ticket-type.command-handler';
import { TicketTypeCreatedIntegrationEventHandler } from '../integration/handlers/ticket-type-created.integration-event-handler';
import { RootEventsModule } from 'src/modules/events/public/modules';
import { RootUsersModule } from 'src/modules/users/public/modules';
import { PaymentService } from '../application/payments/payment.service';
import { CreateOrderCommandHandler } from '../application/orders/create-order/create-order.command-handler';
import { OrdersController } from '../presentation/orders/orders.controller';
import { RefundCommandHandler } from '../application/payments/refund/refund-command-handler';
import { PaymentsController } from '../presentation/payments/payments.controller';
import { TicketingOutboxConfigProvider } from './outbox/outbox.config';
import { OutboxPersistenceHandlerProvider } from './outbox/outbox-persistence.handler';
import { TicketingOutboxMessageTypeOrmEntity } from './outbox/outbox-message.entity';
import { OutboxConsumerRepositoryProvider } from './outbox/outbox-consumed-message.repository';
import { TicketingOutboxConsumedMessageTypeOrmEntity } from './outbox/outbox-consumed-message.entity';

const cartsProviders: Provider[] = [CartService, AddToCartCommandHandler];
const customersProviders: Provider[] = [CustomerRepositoryProvider, CreateCustomerCommandHandler];
const ordersProviders: Provider[] = [OrderRepositoryProvider, CreateOrderCommandHandler];
const paymentsProviders: Provider[] = [
  PaymentRepositoryProvider,
  PaymentService,
  RefundCommandHandler,
];

const ticketTypesProviders: Provider[] = [
  TicketTypeRepositoryProvider,
  CreateTicketTypeCommandHandler,
];

const ticketsProviders: Provider[] = [TicketRepositoryProvider];

const integrationProviders: Provider[] = [
  UserRegisteredIntegrationEventHandler,
  TicketTypeCreatedIntegrationEventHandler,
];

const outboxProviders: Provider[] = [
  TicketingOutboxConfigProvider,
  OutboxPersistenceHandlerProvider,
  OutboxConsumerRepositoryProvider,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerTypeOrmEntity,
      OrderItemTypeOrmEntity,
      OrderTypeOrmEntity,
      PaymentTypeOrmEntity,
      TicketTypeTypeOrmEntity,
      TicketTypeOrmEntity,
      TicketingOutboxMessageTypeOrmEntity,
      TicketingOutboxConsumedMessageTypeOrmEntity,
    ]),
    RootUsersModule,
    RootEventsModule,
  ],
  providers: [
    ...cartsProviders,
    ...customersProviders,
    ...integrationProviders,
    ...ordersProviders,
    ...paymentsProviders,
    ...ticketTypesProviders,
    ...ticketsProviders,
    ...outboxProviders,
  ],
  controllers: [CartsController, OrdersController, PaymentsController],
})
export class RootTicketingModule {}

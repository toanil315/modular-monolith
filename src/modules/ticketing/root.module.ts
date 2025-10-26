import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './infrastructure/customers/customer.entity';
import { CartService } from './application/carts/cart.service';
import { AddToCartCommandHandler } from './application/carts/add-to-cart/add-to-cart.command-handler';
import { CustomerRepositoryProvider } from './infrastructure/customers/customer.repository.impl';
import { CreateCustomerCommandHandler } from './application/customers/create-customer/create-customer.command-handler';
import { CartsController } from './presentation/carts/carts.controller';
import { UserRegisteredIntegrationEventHandler } from './integration/handlers/user-registered.integration-event-handler';
import { OrderItemTypeOrmEntity } from './infrastructure/orders/order-item.entity';
import { OrderTypeOrmEntity } from './infrastructure/orders/order.entity';
import { PaymentTypeOrmEntity } from './infrastructure/payments/payment.entity';
import { TicketTypeTypeOrmEntity } from './infrastructure/ticket-types/ticket-type.entity';
import { TicketTypeOrmEntity } from './infrastructure/tickets/ticket.entity';
import { OrderRepositoryProvider } from './infrastructure/orders/order.repository.impl';
import { PaymentRepositoryProvider } from './infrastructure/payments/payment.repository.impl';
import { TicketTypeRepositoryProvider } from './infrastructure/ticket-types/ticket-type.repository.impl';
import { TicketRepositoryProvider } from './infrastructure/tickets/ticket.repository.impl';
import { CreateTicketTypeCommandHandler } from './application/ticket-types/create-ticket-type.command-handler';
import { TicketTypeCreatedIntegrationEventHandler } from './integration/handlers/ticket-type-created.integration-event-handler';
import { RootEventsModule } from 'src/modules/events/public/modules';
import { RootUsersModule } from 'src/modules/users/public/modules';
import { PaymentService } from './application/payments/payment.service';
import { CreateOrderCommandHandler } from './application/orders/create-order/create-order.command-handler';
import { OrdersController } from './presentation/orders/orders.controller';
import { RefundCommandHandler } from './application/payments/refund/refund-command-handler';
import { PaymentsController } from './presentation/payments/payments.controller';
import { TicketingOutboxConfigProvider } from './infrastructure/outbox/outbox.config';
import { OutboxPersistenceHandlerProvider } from './infrastructure/outbox/outbox-persistence.handler';
import { TicketingOutboxMessageTypeOrmEntity } from './infrastructure/outbox/outbox-message.entity';
import { OutboxConsumerRepositoryProvider } from './infrastructure/outbox/outbox-consumed-message.repository';
import { TicketingOutboxConsumedMessageTypeOrmEntity } from './infrastructure/outbox/outbox-consumed-message.entity';
import { InboxConsumerRepositoryProvider } from './infrastructure/inbox/inbox-consumed-message.repository';
import { TicketingInboxConsumedMessageTypeOrmEntity } from './infrastructure/inbox/inbox-consumed-message.entity';
import { TicketingInboxConfigProvider } from './infrastructure/inbox/inbox.config';
import { CreateTicketBatchCommandHandler } from './application/tickets/create-ticket-batch/create-ticket-batch.command-handler';
import { CreateTicketsDomainEventHandler } from './application/orders/create-order/create-tickets.domain-event-handler';
import { IntegrationEventsPublisherProvider } from './integration/publishers/integration-events.publisher';

const cartsProviders: Provider[] = [CartService, AddToCartCommandHandler];
const customersProviders: Provider[] = [CustomerRepositoryProvider, CreateCustomerCommandHandler];
const ordersProviders: Provider[] = [
  OrderRepositoryProvider,
  CreateOrderCommandHandler,
  CreateTicketsDomainEventHandler,
];
const paymentsProviders: Provider[] = [
  PaymentRepositoryProvider,
  PaymentService,
  RefundCommandHandler,
];

const ticketTypesProviders: Provider[] = [
  TicketTypeRepositoryProvider,
  CreateTicketTypeCommandHandler,
];

const ticketsProviders: Provider[] = [TicketRepositoryProvider, CreateTicketBatchCommandHandler];

const integrationProviders: Provider[] = [
  UserRegisteredIntegrationEventHandler,
  TicketTypeCreatedIntegrationEventHandler,
  IntegrationEventsPublisherProvider,
];

const outboxProviders: Provider[] = [
  TicketingOutboxConfigProvider,
  OutboxPersistenceHandlerProvider,
  OutboxConsumerRepositoryProvider,
];

const inboxProviders: Provider[] = [TicketingInboxConfigProvider, InboxConsumerRepositoryProvider];

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
      TicketingInboxConsumedMessageTypeOrmEntity,
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
    ...inboxProviders,
  ],
  controllers: [CartsController, OrdersController, PaymentsController],
})
export class RootTicketingModule {}

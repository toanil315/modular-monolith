import { Module, Provider } from '@nestjs/common';
import { RootEventsModule } from 'src/modules/events/infrastructure/root.module';
import { RootUsersModule } from 'src/modules/users/infrastructure/root.module';
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

const cartsProviders: Provider[] = [CartService, AddToCartCommandHandler];
const customersProviders: Provider[] = [CustomerRepositoryProvider, CreateCustomerCommandHandler];
const ordersProviders: Provider[] = [OrderRepositoryProvider];
const paymentsProviders: Provider[] = [PaymentRepositoryProvider];
const ticketInventoriesProviders: Provider[] = [TicketTypeRepositoryProvider];
const ticketsProviders: Provider[] = [TicketRepositoryProvider];
const integrationProviders: Provider[] = [UserRegisteredIntegrationEventHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerTypeOrmEntity,
      OrderItemTypeOrmEntity,
      OrderTypeOrmEntity,
      PaymentTypeOrmEntity,
      TicketTypeTypeOrmEntity,
      TicketTypeOrmEntity,
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
    ...ticketInventoriesProviders,
    ...ticketsProviders,
  ],
  controllers: [CartsController],
})
export class RootTicketingModule {}

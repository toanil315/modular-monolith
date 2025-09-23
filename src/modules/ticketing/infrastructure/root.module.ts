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

const cartsProviders: Provider[] = [CartService, AddToCartCommandHandler];

const customersProviders: Provider[] = [CustomerRepositoryProvider, CreateCustomerCommandHandler];

const integrationProviders: Provider[] = [UserRegisteredIntegrationEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity]), RootUsersModule, RootEventsModule],
  providers: [...cartsProviders, ...customersProviders, ...integrationProviders],
  controllers: [CartsController],
})
export class RootTicketingModule {}

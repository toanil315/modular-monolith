import { Module } from '@nestjs/common';
import { RootEventsModule } from 'src/modules/events/infrastructure/root.module';
import { RootUsersModule } from 'src/modules/users/infrastructure/root.module';
import { AddToCartCommandHandler } from '../application/carts/add-to-cart/add-to-cart.command-handler';
import { CartService } from '../application/carts/cart.service';
import { CartsController } from '../presentation/carts/carts.controller';
import { CustomersModule } from './customer/customers.module';
import { TicketingIntegrationModule } from './integration/integration.module';

@Module({
  imports: [RootUsersModule, RootEventsModule, CustomersModule, TicketingIntegrationModule],
  providers: [CartService, AddToCartCommandHandler],
  controllers: [CartsController],
})
export class RootTicketingModule {}

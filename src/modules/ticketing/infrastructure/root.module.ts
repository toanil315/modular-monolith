import { Module } from '@nestjs/common';
import { RootEventsModule } from 'src/modules/events/infrastructure/root.module';
import { RootUsersModule } from 'src/modules/users/infrastructure/root.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrmEntity } from './customers/customer.entity';
import { CartService } from '../application/carts/cart.service';
import { AddToCartCommandHandler } from '../application/carts/add-to-cart/add-to-cart.command-handler';
import { CustomerRepositoryProvider } from './customers/customer.repository.impl';
import { CreateCustomerCommandHandler } from '../application/customers/create-customer/create-customer.command-handler';
import { CartsController } from '../presentation/carts/carts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity]), RootUsersModule, RootEventsModule],
  providers: [
    CartService,
    AddToCartCommandHandler,
    CustomerRepositoryProvider,
    CreateCustomerCommandHandler,
  ],
  controllers: [CartsController],
})
export class RootTicketingModule {}

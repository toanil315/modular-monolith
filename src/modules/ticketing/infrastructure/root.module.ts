import { Module } from '@nestjs/common';
import { RootEventsModule } from 'src/modules/events/infrastructure/root.module';
import { RootUsersModule } from 'src/modules/users/infrastructure/root.module';
import { AddToCartCommandHandler } from '../application/carts/add-to-cart/add-to-cart.command-handler';
import { CartService } from '../application/carts/cart.service';
import { CartsController } from '../presentation/carts/carts.controller';

@Module({
  imports: [RootUsersModule, RootEventsModule],
  providers: [CartService, AddToCartCommandHandler],
  controllers: [CartsController],
})
export class RootTicketingModule {}

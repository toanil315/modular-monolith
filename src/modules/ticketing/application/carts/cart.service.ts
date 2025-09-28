import { Inject, Injectable } from '@nestjs/common';
import {
  CACHING_SERVICE_TOKEN,
  CachingService,
} from 'src/modules/common/application/caching/caching.service';
import { Cart } from '../../domain/carts/cart';
import { CartItem } from '../../domain/carts/cart-item';

@Injectable()
export class CartService {
  private static readonly DEFAULT_EXPIRATION = 1000 * 60 * 20;

  constructor(@Inject(CACHING_SERVICE_TOKEN) private cachingService: CachingService) {}

  async get(customerId: string) {
    const cacheKey = this.createCacheKey(customerId);
    const cart = (await this.cachingService.get<Cart>(cacheKey)) ?? Cart.create(customerId);
    return cart;
  }

  async clear(customerId: string) {
    const cacheKey = this.createCacheKey(customerId);
    const cart = Cart.create(customerId);
    await this.cachingService.set(cacheKey, cart, CartService.DEFAULT_EXPIRATION);
  }

  async addItem(customerId: string, cartItem: CartItem) {
    const cacheKey = this.createCacheKey(customerId);
    const cart = await this.get(customerId);
    const existingCartItem = cart.items.find((item) => item.ticketTypeId === cartItem.ticketTypeId);

    if (!existingCartItem) {
      cart.items.push(cartItem);
    } else {
      existingCartItem.quantity += cartItem.quantity;
    }

    await this.cachingService.set(cacheKey, cacheKey, CartService.DEFAULT_EXPIRATION);
    return cart;
  }

  async setItem(customerId: string, cartItem: CartItem) {
    const cacheKey = this.createCacheKey(customerId);
    const cart = await this.get(customerId);
    const existingCartItem = cart.items.find((item) => item.ticketTypeId === cartItem.ticketTypeId);

    if (!existingCartItem) {
      cart.items.push(cartItem);
    } else {
      existingCartItem.quantity = cartItem.quantity;
    }

    await this.cachingService.set(cacheKey, cacheKey, CartService.DEFAULT_EXPIRATION);
    return cart;
  }

  async removeItem(customerId: string, ticketTypeId: string) {
    const cacheKey = this.createCacheKey(customerId);
    const cart = await this.get(customerId);
    const existingCartItemIndex = cart.items.findIndex(
      (item) => item.ticketTypeId === ticketTypeId,
    );

    if (existingCartItemIndex === -1) {
      return cart;
    }

    cart.items.splice(existingCartItemIndex, 1);
    await this.cachingService.set(cacheKey, cacheKey, CartService.DEFAULT_EXPIRATION);
    return cart;
  }

  private createCacheKey(customerId: string) {
    return `carts:${customerId}`;
  }
}

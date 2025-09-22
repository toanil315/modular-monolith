import { CartItem } from './cart-item';

export class Cart {
  constructor(
    public customerId: string,
    public items: CartItem[] = [],
  ) {}

  static create(customerId: string): Cart {
    return new Cart(customerId);
  }
}

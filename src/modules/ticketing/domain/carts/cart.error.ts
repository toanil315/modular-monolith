import { BusinessError } from 'src/modules/common/domain/error';

export namespace CartError {
  export const CartEmptyError = BusinessError.Problem('CART.EMPTY', 'Cart is empty!');
}

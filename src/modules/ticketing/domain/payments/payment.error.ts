import { BusinessError } from 'src/modules/common/domain/error';

export namespace PaymentError {
  export const NotFound = (paymentId: string) =>
    BusinessError.NotFound(
      'PAYMENTS.NOT_FOUND',
      `The payment with the identifier ${paymentId} was not found`,
    );

  export const AlreadyRefunded = BusinessError.Problem(
    'PAYMENTS.ALREADY_REFUNDED',
    'The payment was already refunded',
  );

  export const NotEnoughFunds = BusinessError.Problem(
    'PAYMENTS.NOT_ENOUGH_FUNDS',
    'There are not enough funds for a refund',
  );
}

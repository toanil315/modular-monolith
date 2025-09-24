import { BusinessError } from 'src/modules/common/domain/error';

export namespace OrderErrors {
  export const OrderNotFoundError = (orderId: string) =>
    BusinessError.NotFound(
      'ORDERS.NOT_FOUND',
      `The order with the identifier ${orderId} was not found`,
    );

  export const TicketsAlreadyIssued = BusinessError.Problem(
    'ORDERS.TICKETS_ALREADY_ISSUED',
    'The tickets for this order were already issued',
  );
}

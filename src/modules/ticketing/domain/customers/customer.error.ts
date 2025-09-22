import { BusinessError } from 'src/modules/common/domain/error';

export namespace CustomerErrors {
  export const CustomerNotFoundError = (customerId: string) =>
    BusinessError.NotFound(
      'CUSTOMERS.NOT_FOUND',
      `The customer with the identifier ${customerId} was not found`,
    );
}

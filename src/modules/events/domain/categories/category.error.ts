import { BusinessError } from 'src/modules/common/domain/error';

export namespace CategoryErrors {
  export const CategoryNotFoundError = (categoryId: string) =>
    BusinessError.NotFound(
      'CATEGORIES.NOT_FOUND',
      `The category with the identifier ${categoryId} was not found`,
    );
}

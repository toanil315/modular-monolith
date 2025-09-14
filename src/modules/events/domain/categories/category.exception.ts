import { BusinessException } from 'src/modules/common/infrastructure/exceptions/business/business.exception';

export namespace CategoryExceptions {
  export class CategoryNotFoundException extends BusinessException {
    constructor(categoryId: string) {
      super({
        code: 'CATEGORIES.NOT_FOUND',
        message: `The category with the identifier ${categoryId} was not found`,
      });
    }
  }
}

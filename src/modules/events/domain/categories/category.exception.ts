import { BusinessError } from 'src/modules/common/domain/error';

export namespace CategoryExceptions {
  export class CategoryNotFoundException extends BusinessError {
    constructor(categoryId: string) {
      super({
        code: 'CATEGORIES.NOT_FOUND',
        message: `The category with the identifier ${categoryId} was not found`,
      });
    }
  }
}

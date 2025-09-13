import { HttpStatus } from '@nestjs/common';
import { CategoryExceptions } from '../../domain/categories/category.exception';

export const CategoryExceptionRegistry = new Map<Function, number>([
  [CategoryExceptions.CategoryNotFoundException, HttpStatus.NOT_FOUND],
]);

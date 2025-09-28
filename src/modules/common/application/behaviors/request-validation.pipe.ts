import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ValidationException } from '../exceptions/validation.exception';

export const RequestValidationPipe: ReturnType<typeof createZodValidationPipe> =
  createZodValidationPipe({
    createValidationException: (error: ZodError) => new ValidationException(error),
  });

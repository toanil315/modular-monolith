import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ValidationException } from './validation.exception';

export const ValidationPipe: ReturnType<typeof createZodValidationPipe> =
  createZodValidationPipe({
    createValidationException: (error: ZodError) =>
      new ValidationException(error),
  });

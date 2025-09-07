import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError, z } from 'zod';
import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';

export const CustomZodValidationPipe: ReturnType<
  typeof createZodValidationPipe
> = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new BusinessException({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      status: HttpStatus.BAD_REQUEST,
      details: z.flattenError(error).fieldErrors,
    }),
});

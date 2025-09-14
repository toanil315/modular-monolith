import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { ResponseTransformInterceptor } from './response.formatter.interceptor';
import z from 'zod';

export function ApiZodResponse({
  type,
  description,
}: {
  type: ReturnType<typeof createZodDto>;
  description?: string;
}) {
  return applyDecorators(
    ApiOkResponse({
      description,
      type: type.Output,
    }),
    UseInterceptors(new ResponseTransformInterceptor(type.schema as z.ZodAny)),
  );
}

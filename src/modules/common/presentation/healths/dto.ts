import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiSuccessResponseSchema } from '../../infrastructure/validation/common.schema';

const DetailSchema = z.object({
  status: z.string().nonempty(),
  error: z.string().optional(),
});

export const ResponseSchema = z.object({
  status: z.string().nonempty(),
  details: z.record(z.string(), DetailSchema),
});

export class GetHealthResponseDto extends createZodDto(ApiSuccessResponseSchema(ResponseSchema)) {}

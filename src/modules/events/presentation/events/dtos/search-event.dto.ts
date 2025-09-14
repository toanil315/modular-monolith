import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import z from 'zod';

const RequestSchema = z.object({
  categoryId: z.uuid().optional(),
  startsAt: z.coerce.number().nonnegative().optional(),
  endsAt: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().min(1),
  size: z.coerce.number().min(1).max(100),
});

export const ResponseSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalCount: z.number(),
  records: z.array(
    z.object({
      id: z.string().uuid(),
      categoryId: z.string().uuid().optional(),
      title: z.string(),
      description: z.string(),
      location: z.string(),
      startsAt: z.number(),
      endsAt: z.number(),
      status: z.number(),
    }),
  ),
});

export class SearchEventsDto extends createZodDto(RequestSchema) {}
export class SearchEventsResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  id: z.uuid(),
});

const ResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty(),
  isArchived: z.boolean(),
});

export class GetCategoryByIdDto extends createZodDto(RequestSchema) {}
export class GetCategoryResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

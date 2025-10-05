import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/infrastructure/validation/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  name: z.string().max(255).nonempty(),
});

export const ResponseSchema = z.object({
  id: z.uuid(),
});

export class CreateCategoryDto extends createZodDto(RequestSchema) {}
export class CreateCategoryResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

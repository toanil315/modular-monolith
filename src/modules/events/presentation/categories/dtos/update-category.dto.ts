import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  id: z.uuid().nonempty(),
  name: z.string().max(255).nonempty(),
});

export class UpdateCategoryDto extends createZodDto(RequestSchema) {}
export class UpdateCategoryResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

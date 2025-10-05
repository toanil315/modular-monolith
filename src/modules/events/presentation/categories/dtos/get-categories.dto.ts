import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

const ResponseSchema = z.array(
  z.object({
    id: z.uuid(),
    name: z.string().nonempty(),
    isArchived: z.boolean(),
  }),
);

export class GetCategoriesResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

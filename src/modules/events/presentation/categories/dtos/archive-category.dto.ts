import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  id: z.uuid(),
});

export class ArchiveCategoryDto extends createZodDto(RequestSchema) {}
export class ArchiveCategoryResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

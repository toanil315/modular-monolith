import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  id: z.uuid(),
  firstName: z.string().max(255).nonempty(),
  lastName: z.string().max(255).nonempty(),
});

export class UpdateUserProfileDto extends createZodDto(RequestSchema) {}
export class UpdateUserProfileResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

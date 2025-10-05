import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/infrastructure/validation/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  id: z.uuid(),
});

const ResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string().max(255).nonempty(),
  lastName: z.string().max(255).nonempty(),
  email: z.email().nonempty(),
});

export class GetUserByIdDto extends createZodDto(RequestSchema) {}
export class GetUserByIdResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

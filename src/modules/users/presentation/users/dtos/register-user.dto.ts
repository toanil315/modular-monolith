import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  firstName: z.string().max(255).nonempty(),
  lastName: z.string().max(255).nonempty(),
  email: z.email().nonempty(),
  password: z.string().max(255).nonempty(),
});

const ResponseSchema = z.object({
  id: z.uuid(),
});

export class RegisterUserDto extends createZodDto(RequestSchema) {}
export class RegisterUserResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

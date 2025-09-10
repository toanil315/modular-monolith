import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/validations/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  title: z.string().max(255).nonempty(),
  description: z.string().max(500).nonempty(),
  location: z.string().max(255).nonempty(),
  startsAt: z.number().nonnegative(),
  endsAt: z.number().nonnegative(),
});

export const ResponseSchema = z.object({
  id: z.uuid(),
});

export class CreateEventDto extends createZodDto(RequestSchema) {}
export class CreateEventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

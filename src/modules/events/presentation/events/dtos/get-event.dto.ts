import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/validations/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  id: z.uuid(),
});

const ResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().max(255).nonempty(),
  description: z.string().max(500).nonempty(),
  location: z.string().max(255).nonempty(),
  startsAt: z.number().nonnegative(),
  endsAt: z.number().nonnegative(),
});

export class GetEventByIdDto extends createZodDto(RequestSchema) {}
export class GetEventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

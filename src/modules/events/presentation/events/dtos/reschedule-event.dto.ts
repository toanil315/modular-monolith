import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/validations/common.schema';
import z from 'zod';

const RequestSchema = z.object({
  id: z.uuid().nonempty(),
  startsAt: z.number().nonnegative(),
  endsAt: z.number().nonnegative(),
});

export class RescheduleEventDto extends createZodDto(RequestSchema) {}
export class RescheduleEventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import z from 'zod';

const RequestSchema = z.object({
  id: z.uuid().nonempty(),
});

export class CancelEventDto extends createZodDto(RequestSchema) {}
export class CancelEventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

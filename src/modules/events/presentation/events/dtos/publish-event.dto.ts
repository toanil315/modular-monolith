import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/validations/common.schema';
import z from 'zod';

const RequestSchema = z.object({
  id: z.uuid().nonempty(),
});

export class PublishEventDto extends createZodDto(RequestSchema) {}
export class PublishEventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

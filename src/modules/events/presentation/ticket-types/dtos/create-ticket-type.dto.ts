import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  eventId: z.uuid().nonempty(),
  name: z.string().max(255).nonempty(),
  price: z.number().nonnegative().nonoptional(),
  currency: z.string().nonempty(),
  quantity: z.number().nonnegative().nonoptional(),
});

export const ResponseSchema = z.object({
  id: z.uuid(),
});

export class CreateTicketTypeDto extends createZodDto(RequestSchema) {}
export class CreateTicketTypeResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

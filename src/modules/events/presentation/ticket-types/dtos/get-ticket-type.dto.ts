import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/infrastructure/validation/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  id: z.uuid(),
});

const ResponseSchema = z.object({
  id: z.uuid(),
  eventId: z.uuid().nonempty(),
  name: z.string().max(255).nonempty(),
  price: z.number().nonnegative().nonoptional(),
  currency: z.string().nonempty(),
  quantity: z.number().nonnegative().nonoptional(),
});

export class GetTicketTypeByIdDto extends createZodDto(RequestSchema) {}
export class GetTicketTypeResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

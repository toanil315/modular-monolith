import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import { z } from 'zod';

export const RequestSchema = z.object({
  eventId: z.uuid().nonempty(),
});

const ResponseSchema = z.array(
  z.object({
    id: z.uuid(),
    eventId: z.uuid().nonempty(),
    name: z.string().max(255).nonempty(),
    price: z.number().nonnegative().nonoptional(),
    currency: z.string().nonempty(),
    quantity: z.number().nonnegative().nonoptional(),
  }),
);

export class GetTicketTypesDto extends createZodDto(RequestSchema) {}
export class GetTicketTypesResponseDto extends createZodDto(
  ApiSuccessResponseSchema(ResponseSchema),
) {}

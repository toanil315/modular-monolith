import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/infrastructure/validation/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  id: z.uuid().nonempty(),
  price: z.number().nonnegative().nonoptional(),
});

export class UpdateTicketTypePriceDto extends createZodDto(RequestSchema) {}
export class UpdateTicketTypePriceResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

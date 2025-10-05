import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/abstractions/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  customerId: z.uuid().nonempty(),
  ticketTypeId: z.uuid().nonempty(),
  quantity: z.int32().min(1).nonoptional(),
});

export class AddToCartDto extends createZodDto(RequestSchema) {}
export class AddToCartResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

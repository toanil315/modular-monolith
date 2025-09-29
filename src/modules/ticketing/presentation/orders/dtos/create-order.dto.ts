import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/presentation/validations/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  customerId: z.uuid().nonempty(),
});

export class CreateOrderDto extends createZodDto(RequestSchema) {}
export class CreateOrderResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

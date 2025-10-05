import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/infrastructure/validation/common.schema';
import { z } from 'zod';

const RequestSchema = z.object({
  paymentId: z.uuid().nonempty(),
  amount: z.number().min(0),
});

export class RefundDto extends createZodDto(RequestSchema) {}
export class RefundResponseDto extends createZodDto(
  ApiSuccessResponseSchema(z.object().nullable()),
) {}

import { createZodDto } from 'nestjs-zod';
import { ApiSuccessResponseSchema } from 'src/modules/common/validations/common.schema';
import { z } from 'zod';

const EventBaseSchema = z.object({
  title: z.string().max(255).nonempty(),
  description: z.string().max(500).nonempty(),
  location: z.string().max(255).nonempty(),
  startsAt: z.number().nonnegative(),
  endsAt: z.number().nonnegative(),
});

export const EventSchema = EventBaseSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export const GetEventByIdSchema = z.object({
  id: z.uuid(),
});

export class CreateEventDto extends createZodDto(EventBaseSchema) {}
export class GetEventByIdDto extends createZodDto(GetEventByIdSchema) {}
export class EventResponseDto extends createZodDto(
  ApiSuccessResponseSchema(EventSchema),
) {}

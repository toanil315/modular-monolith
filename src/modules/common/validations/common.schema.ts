import { z } from 'zod';

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.literal(true),
    data: dataSchema.nullable(),
    message: z.string().optional(),
  });

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  timestamp: z.iso.datetime(),
});

export type ApiSuccessResponse<T> = z.infer<
  ReturnType<typeof ApiSuccessResponseSchema<z.ZodType<T>>>
>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

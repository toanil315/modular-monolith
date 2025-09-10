import { z } from 'zod';

export interface BusinessExceptionOptions {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}

export class ValidationException extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(error: z.ZodError, message: string = 'Validation failed') {
    super(message);
    this.details = this.formatError(error);

    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  formatError(error: z.ZodError) {
    return z.flattenError(error).fieldErrors;
  }
}

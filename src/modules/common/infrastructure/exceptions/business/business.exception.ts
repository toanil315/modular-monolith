export interface BusinessExceptionOptions {
  code: string;
  message: string;
  details?: unknown;
}

export class BusinessException extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor({ code, message, details }: BusinessExceptionOptions) {
    super(message);
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

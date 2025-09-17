export interface BusinessErrorOptions {
  code: string;
  message: string;
  details?: unknown;
}

export class BusinessError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor({ code, message, details }: BusinessErrorOptions) {
    super(message);
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

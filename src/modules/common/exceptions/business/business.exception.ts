export interface BusinessExceptionOptions {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}

export class BusinessException extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly status: number;

  constructor({
    code,
    message,
    details,
    status = 400,
  }: BusinessExceptionOptions) {
    super(message);
    this.code = code;
    this.details = details;
    this.status = status;

    Object.setPrototypeOf(this, BusinessException.prototype);
  }
}

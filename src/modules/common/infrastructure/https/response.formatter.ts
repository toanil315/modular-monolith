import { ApiErrorResponse, ApiSuccessResponse } from '../validation/common.schema';

export class ResponseFormatter {
  static success<T>(data: T, message?: string): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(code: string, message: string, details?: unknown): ApiErrorResponse {
    return {
      success: false,
      error: { code, message, details },
      timestamp: new Date().toISOString(),
    };
  }
}

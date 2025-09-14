import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BusinessException } from '../business/business.exception';
import { ValidationException } from '../validation/validation.exception';
import { Response } from 'express';

@Catch()
export class ServerExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof BusinessException) {
      throw exception;
    }

    if (exception instanceof ValidationException) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json({
      success: false,
      message: (exception as any).message || 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}

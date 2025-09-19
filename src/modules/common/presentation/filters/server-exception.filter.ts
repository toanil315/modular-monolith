import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationException } from '../../application/exceptions/validation.exception';
import { Response } from 'express';
import { BusinessError } from 'src/modules/common/domain/error';

@Catch()
export class ServerExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof BusinessError) {
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

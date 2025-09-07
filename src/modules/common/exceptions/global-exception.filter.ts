import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../formatters/response.formatter';
import { BusinessException } from './business.exception';

@Catch()
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BusinessException) {
      console.log(exception);
      return response
        .status(exception.status)
        .json(
          ResponseFormatter.error(
            exception.code,
            exception.message,
            exception.details,
          ),
        );
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        ResponseFormatter.error('INTERNAL_ERROR', 'Unexpected error occurred'),
      );
  }
}

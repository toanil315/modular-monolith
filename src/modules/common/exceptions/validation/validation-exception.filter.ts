import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../../http/response.formatter';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.BAD_REQUEST)
      .json(
        ResponseFormatter.error(
          'VALIDATION_ERROR',
          exception.message,
          exception.details,
        ),
      );
  }
}

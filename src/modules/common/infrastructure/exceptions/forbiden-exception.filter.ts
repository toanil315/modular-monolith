import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../../presentation/abstractions/response.formatter';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.FORBIDDEN)
      .json(ResponseFormatter.error('FORBIDDEN', exception.message));
  }
}

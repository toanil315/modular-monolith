import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../http/response.formatter';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.UNAUTHORIZED)
      .json(ResponseFormatter.error('UN_AUTHORIZED', exception.message));
  }
}

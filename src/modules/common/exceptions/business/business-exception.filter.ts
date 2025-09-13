import {
  ExceptionFilter,
  ArgumentsHost,
  Inject,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../../formatters/response.formatter';
import { BusinessException } from './business.exception';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject('EXCEPTION_REGISTRY')
    private readonly registry: Map<Function, number>,
  ) {}

  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionStatus = this.fromExceptionToHttpStatus(exception);

    response
      .status(exceptionStatus)
      .json(
        ResponseFormatter.error(
          exception.code,
          exception.message,
          exception.details,
        ),
      );
  }

  private fromExceptionToHttpStatus(exception: BusinessException): number {
    const status = this.registry.get(exception.constructor);
    if (status) return status;
    return HttpStatus.BAD_REQUEST;
  }
}

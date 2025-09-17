import {
  ExceptionFilter,
  ArgumentsHost,
  Inject,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormatter } from '../../../presentation/http/response.formatter';
import { BusinessError } from 'src/modules/common/domain/error';

@Catch(BusinessError)
export class BusinessErrorFilter implements ExceptionFilter {
  constructor(
    @Inject('EXCEPTION_REGISTRY')
    private readonly registry: Map<Function, number>,
  ) {}

  catch(exception: BusinessError, host: ArgumentsHost) {
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

  private fromExceptionToHttpStatus(exception: BusinessError): number {
    const status = this.registry.get(exception.constructor);
    if (status) return status;
    return HttpStatus.BAD_REQUEST;
  }
}

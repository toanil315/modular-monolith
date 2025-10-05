import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import z from 'zod';
import { ResponseFormatter } from './response.formatter';
import { ApiSuccessResponse } from '../validation/common.schema';
import { Result } from '../../domain/result';
import { ErrorType } from '../../domain/error';
import { Response } from 'express';

@Injectable()
export class ResultTransformInterceptor<T>
  implements NestInterceptor<Result<T>, ApiSuccessResponse<T> | undefined>
{
  constructor(private readonly schema: z.ZodAny) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T> | undefined> {
    return next.handle().pipe(map((result) => this.fromResultToDto(result, context)));
  }

  private fromResultToDto(result: Result<T>, context: ExecutionContext) {
    if (!result.isSuccess) {
      const error = result.businessError!;
      const response: Response = context.switchToHttp().getResponse();
      response
        .status(this.fromErrorTypeToStatusCode(error.type))
        .json(ResponseFormatter.error(error.code, error.message, error.details));

      return;
    }

    const { success, data } = this.schema.safeParse(ResponseFormatter.success(result.value));

    if (!success) {
      throw new InternalServerErrorException('Response validation failed');
    }

    return data as ApiSuccessResponse<T>;
  }

  private fromErrorTypeToStatusCode(type: ErrorType) {
    switch (type) {
      case ErrorType.Problem: {
        return HttpStatus.BAD_REQUEST;
      }

      case ErrorType.NotFound: {
        return HttpStatus.NOT_FOUND;
      }

      case ErrorType.Conflict: {
        return HttpStatus.CONFLICT;
      }

      default: {
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
  }
}

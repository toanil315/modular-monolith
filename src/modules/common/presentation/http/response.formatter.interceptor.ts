import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import z from 'zod';
import { ResponseFormatter } from './response.formatter';
import { ApiSuccessResponse } from '../validations/common.schema';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  constructor(private readonly schema: z.ZodAny) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const toDto = (data: T) => {
      const { data: parsedResult, success } = this.schema.safeParse(
        ResponseFormatter.success(data),
      );

      if (!success) {
        throw new InternalServerErrorException();
      }

      return parsedResult as ApiSuccessResponse<T>;
    };

    return next.handle().pipe(map(toDto));
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import z from 'zod';
import { ResponseFormatter } from './response.formatter';
import { ApiSuccessResponse } from '../validations/common.schema';
import { Result } from '../../domain/result';
import { BusinessError } from '../../domain/error';

@Injectable()
export class ResultTransformInterceptor<T>
  implements NestInterceptor<Result<T>, ApiSuccessResponse<T>>
{
  constructor(private readonly schema: z.ZodAny) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const toDto = (result: Result<T>) => {
      // Handle failures from the domain
      if (!result.isSuccess) {
        const error = result.businessError!;
        const response = context.switchToHttp().getResponse()

   
        }
      }

      // Handle success
      const { success, data } = this.schema.safeParse(
        ResponseFormatter.success(result.value),
      );

      if (!success) {
        throw new InternalServerErrorException('Response validation failed');
      }

      return data as ApiSuccessResponse<T>;
    };

    return next.handle().pipe(map(toDto));
  }
}

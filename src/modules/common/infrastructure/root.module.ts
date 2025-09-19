import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ServerExceptionsFilter } from '../presentation/filters/server-exception.filter';
import { ValidationExceptionFilter } from '../presentation/filters/validation-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CachingServiceProvider } from './caching/caching.service.impl';
import { RequestValidationPipe } from '../application/behaviors/request-validation.pipe';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [new KeyvRedis('redis://:mysecretpassword@localhost:6379')],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ServerExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    CachingServiceProvider,
  ],
  exports: [CachingServiceProvider],
})
export class CommonModule {}

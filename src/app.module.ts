import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './modules/common/infrastructure/exceptions/validation/validation.pipe';
import { ValidationExceptionFilter } from './modules/common/infrastructure/exceptions/validation/validation-exception.filter';
import { CqrsModule } from '@nestjs/cqrs';
import { RootEventsModule } from './modules/events/infrastructure/root.module';
import { ServerExceptionsFilter } from './modules/common/infrastructure/exceptions/server/server-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    RootEventsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ServerExceptionsFilter,
    },
  ],
})
export class AppModule {}

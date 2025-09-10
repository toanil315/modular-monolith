import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { BusinessExceptionFilter } from './modules/common/exceptions/business/business-exception.filter';
import { ValidationPipe } from './modules/common/exceptions/validation/validation.pipe';
import { ValidationExceptionFilter } from './modules/common/exceptions/validation/validation-exception.filter';
import { CqrsModule } from '@nestjs/cqrs';
import { RootEventsModule } from './modules/events/infrastructure/root.module';

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
      useClass: BusinessExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './modules/events/event.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomZodValidationPipe } from './modules/common/exceptions/validation.pipe';
import { BusinessExceptionFilter } from './modules/common/exceptions/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    EventsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
  ],
})
export class AppModule {}

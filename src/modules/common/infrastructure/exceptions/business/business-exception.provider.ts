import { Provider } from '@nestjs/common';
import { EXCEPTION_REGISTRY } from './exception-registry.token';
import { APP_FILTER } from '@nestjs/core';
import { BusinessExceptionFilter } from './business-exception.filter';

export class BusinessExceptionProvider {
  static get(exceptionRegistry: Map<Function, number>): Provider[] {
    return [
      {
        provide: EXCEPTION_REGISTRY,
        useValue: exceptionRegistry,
      },
      {
        provide: APP_FILTER,
        useClass: BusinessExceptionFilter,
      },
    ];
  }
}

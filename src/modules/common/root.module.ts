import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ServerExceptionsFilter } from './infrastructure/exceptions/server-exception.filter';
import { ValidationExceptionFilter } from './infrastructure/exceptions/validation-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CachingServiceProvider } from './infrastructure/caching/caching.service.impl';
import { RequestValidationPipe } from './infrastructure/validation/request-validation.pipe';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseHealthIndicatorProvider } from './infrastructure/healths/database.health-indicator.impl';
import { CacheHealthIndicatorProvider } from './infrastructure/healths/cache.health-indicator.impl';
import { HealthController } from './presentation/healths/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './infrastructure/database/database-configuration';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { UnauthorizedExceptionFilter } from './infrastructure/exceptions/un-authorized.filter';
import { AuthHealthIndicatorProvider } from './infrastructure/healths/auth.health-indicator.impl';
import { ForbiddenExceptionFilter } from './infrastructure/exceptions/forbiden-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusAdapterProvider } from './infrastructure/event-bus/event-bus.adapter.impl';
import {
  TemporalClientProvider,
  TemporalConnectionProvider,
} from './infrastructure/workflow/temporal.client';

const exceptionFilterProviders: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: ServerExceptionsFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ValidationExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: UnauthorizedExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ForbiddenExceptionFilter,
  },
];

const authorizationProviders: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RoleGuard,
  },
];

const healthCheckProviders: Provider[] = [
  DatabaseHealthIndicatorProvider,
  CacheHealthIndicatorProvider,
  AuthHealthIndicatorProvider,
];

const temporalProviders: Provider[] = [TemporalClientProvider, TemporalConnectionProvider];

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
    TerminusModule,
    TypeOrmModule.forRoot(DatabaseConfiguration.get()),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:18080',
      realm: 'evently',
      clientId: 'evently-confidential-client',
      secret: '30sKCRr3II2U3swXxGAm7hHFJ46sU8pQ',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
      logLevels: ['log'],
      useNestLogger: false,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        password: 'mysecretpassword',
        username: '',
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe,
    },
    ...exceptionFilterProviders,
    ...authorizationProviders,
    ...healthCheckProviders,
    ...temporalProviders,

    CachingServiceProvider,

    EventBusAdapterProvider,
  ],
  exports: [CachingServiceProvider, EventBusAdapterProvider, ...temporalProviders],
  controllers: [HealthController],
})
export class CommonModule {}

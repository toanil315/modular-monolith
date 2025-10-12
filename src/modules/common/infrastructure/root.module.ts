import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ServerExceptionsFilter } from './exceptions/server-exception.filter';
import { ValidationExceptionFilter } from './exceptions/validation-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CachingServiceProvider } from './caching/caching.service.impl';
import { RequestValidationPipe } from './validation/request-validation.pipe';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseHealthIndicatorProvider } from './healths/database.health-indicator.impl';
import { CacheHealthIndicatorProvider } from './healths/cache.health-indicator.impl';
import { HealthController } from '../presentation/healths/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './database/database-configuration';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { UnauthorizedExceptionFilter } from './exceptions/un-authorized.filter';
import { AuthHealthIndicatorProvider } from './healths/auth.health-indicator.impl';
import { ForbiddenExceptionFilter } from './exceptions/forbiden-exception.filter';

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
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },

    CachingServiceProvider,

    DatabaseHealthIndicatorProvider,
    CacheHealthIndicatorProvider,
    AuthHealthIndicatorProvider,
  ],
  exports: [CachingServiceProvider],
  controllers: [HealthController],
})
export class CommonModule {}

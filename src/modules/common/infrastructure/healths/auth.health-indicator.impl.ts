import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';
import {
  AUTH_HEALTH_INDICATOR_TOKEN,
  AuthHealthIndicator,
} from '../../application/healths/auth.health-indicator';

@Injectable()
export class AuthHealthIndicatorImpl implements AuthHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,

    private configService: ConfigService,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check('auth');

    try {
      const authHealthCheckUrl = this.configService.getOrThrow('AUTH_HEALTH_CHECK_URL');
      const response = await fetch(authHealthCheckUrl);

      if (response.ok) {
        return indicator.up();
      }

      return indicator.down({ error: 'Auth Service is not running' });
    } catch (error) {
      return indicator.down({ error: error.message });
    }
  }
}

export const AuthHealthIndicatorProvider: Provider = {
  provide: AUTH_HEALTH_INDICATOR_TOKEN,
  useClass: AuthHealthIndicatorImpl,
};

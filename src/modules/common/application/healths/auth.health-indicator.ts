import { HealthIndicatorResult } from '@nestjs/terminus';

export interface AuthHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export const AUTH_HEALTH_INDICATOR_TOKEN = 'AUTH_HEALTH_INDICATOR_TOKEN';

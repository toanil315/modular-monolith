import { HealthIndicatorResult } from '@nestjs/terminus';

export interface DatabaseHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export interface CacheHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export const DATABASE_HEALTH_INDICATOR_TOKEN =
  'DATABASE_HEALTH_INDICATOR_TOKEN';

export const CACHE_HEALTH_INDICATOR_TOKEN = 'CACHE_HEALTH_INDICATOR_TOKEN';

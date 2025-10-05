import { HealthIndicatorResult } from '@nestjs/terminus';

export interface CacheHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export const CACHE_HEALTH_INDICATOR_TOKEN = 'CACHE_HEALTH_INDICATOR_TOKEN';

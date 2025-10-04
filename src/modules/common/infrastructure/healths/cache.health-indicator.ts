import { Inject, Injectable, Provider } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { CACHING_SERVICE_TOKEN, CachingService } from '../../application/caching/caching.service';

export interface CacheHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export const CACHE_HEALTH_INDICATOR_TOKEN = 'CACHE_HEALTH_INDICATOR_TOKEN';

@Injectable()
export class CacheHealthIndicatorImpl implements CacheHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @Inject(CACHING_SERVICE_TOKEN) private cachingService: CachingService,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check('cache');
    const expectedHealthCheckKey = '__healthcheck__';
    const expectedHealthCheckValue = 'ok';

    try {
      await this.cachingService.set(expectedHealthCheckKey, expectedHealthCheckValue, 100);
      const value = await this.cachingService.get(expectedHealthCheckKey);

      if (value === expectedHealthCheckValue) {
        return indicator.up();
      }

      return indicator.down({
        reason: 'Redis returned unexpected value',
        expected: expectedHealthCheckValue,
        actual: value,
      });
    } catch (error) {
      return indicator.down({ error: error.message });
    }
  }
}

export const CacheHealthIndicatorProvider: Provider = {
  provide: CACHE_HEALTH_INDICATOR_TOKEN,
  useClass: CacheHealthIndicatorImpl,
};

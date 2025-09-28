import { Injectable, Inject, Provider } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHING_SERVICE_TOKEN, CachingService } from '../../application/caching/caching.service';

@Injectable()
class CachingServiceImpl implements CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.cacheManager.get<T | null>(key);
    return data ?? null;
  }

  async set<T>(key: string, value: T, expiration: number = 2000): Promise<void> {
    await this.cacheManager.set(key, value, expiration);
  }

  async remove(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}

export const CachingServiceProvider: Provider = {
  provide: CACHING_SERVICE_TOKEN,
  useClass: CachingServiceImpl,
};

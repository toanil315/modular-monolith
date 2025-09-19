export interface CachingService {
  get<T>(key: string): Promise<T | null>;

  set<T>(key: string, value: T, expiration?: number): Promise<void>;

  remove(key: string): Promise<void>;
}

export const CACHING_SERVICE_TOKEN = 'CACHING_SERVICE_TOKEN';

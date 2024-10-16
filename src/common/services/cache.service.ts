import { addMinutes, isAfter } from 'date-fns';

type cacheData<TData> = {
  ttl?: Date,
  data: TData
}

export class CacheService<TData> {
  private cache: Map<string, cacheData<TData>> = new Map();
  private cacheBustInterval: NodeJS.Timeout;

  constructor() {
    this.cacheBustInterval = setInterval(() => {
      const now = new Date();

      for (const [cacheKey, cacheData] of this.cache) {
        if (cacheData.ttl !== undefined && isAfter(now, cacheData.ttl)) {
          this.cache.delete(cacheKey);  
        }
      }
    }, 1000 * 60);
  }

  set(key: string, data: TData, ttlMinutes?: number) {
    this.cache.set(key, {
      data,
      ...ttlMinutes && {
        ttl: addMinutes(new Date(), ttlMinutes)
      }
    });
  }

  size() {
    return this.cache.size;
  }

  get(key: string): TData | undefined {
    const cachedData = this.cache.get(key);

    if (!cachedData) return undefined;
    return cachedData.data;
  }

  clear() {
    this.cache.clear();
  }

  destroy() {
    clearTimeout(this.cacheBustInterval);
  }
}
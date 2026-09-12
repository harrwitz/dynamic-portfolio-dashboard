interface CacheEntry<T> {
    value: T;
    timestamp: number;
}
const CACHE_TTL_MS=12000;

const cache = new Map<string, CacheEntry<unknown>>();

export function getFromCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) {
        return null;
    }
    const age = Date.now() - entry.timestamp;
    if (age > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.value as T;
}

export function setInCache<T>(key: string, value: T): void {
    cache.set(key, { value, timestamp: Date.now() });
}
export function getStale<T>(key: string): T | null {
  const entry = cache.get(key);
  return entry ? (entry.value as T) : null;
}
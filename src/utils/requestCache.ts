/**
 * A fast, resilient in-memory cache for GET-shaped API calls, scoped to this browser tab's
 * lifetime. Powers instant Stale-While-Revalidate (SWR) transitions between app pages.
 *
 * Capabilities:
 *  - Synchronous cache reads (`getAnyCached`, `getCached`): components can initialize state
 *    with already-loaded data on their very first render tick, completely eliminating skeleton
 *    flashes when switching between sidebar pages.
 *  - Time-based freshness: entries within `ttlMs` (default 60s) are served straight from memory.
 *  - In-flight de-duplication: concurrent requests for the same key share a single network call.
 *  - Background revalidation: stale data is shown immediately while fresh server data updates in the background.
 */

interface CacheEntry<T> {
  value: T;
  storedAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

export const DEFAULT_CACHE_TTL_MS = 60_000;

/**
 * Retrieves cached entry if present in memory.
 * Returns { value, storedAt, isFresh } so caller can decide
 * whether to serve it immediately and/or revalidate in background (SWR).
 */
export function getAnyCached<T>(
  key: string,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): { value: T; storedAt: number; isFresh: boolean } | undefined {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (!cached) return undefined;
  return {
    value: cached.value,
    storedAt: cached.storedAt,
    isFresh: Date.now() - cached.storedAt < ttlMs,
  };
}

/**
 * Returns the cached value for `key` if it's strictly younger than `ttlMs`.
 */
export function getCached<T>(key: string, ttlMs: number = DEFAULT_CACHE_TTL_MS): T | undefined {
  const entry = getAnyCached<T>(key, ttlMs);
  return entry?.isFresh ? entry.value : undefined;
}

/**
 * Stores a value directly in memory.
 */
export function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, storedAt: Date.now() });
}

/**
 * Returns the cached value for `key` if younger than `ttlMs`; otherwise calls
 * `fetcher()`, caches the result, and returns it. Concurrent calls for the same
 * `key` while a fetch is already in flight share that one promise.
 */
export function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<T> {
  const fresh = getCached<T>(key, ttlMs);
  if (fresh !== undefined) {
    return Promise.resolve(fresh);
  }

  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = fetcher()
    .then((value) => {
      setCached(key, value);
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Drops every cached entry and forgets in-flight deduplications.
 * Call after mutations (revoking a device, changing categories, profile edit) and sign-in/out.
 */
export function invalidateAll(): void {
  cache.clear();
  inFlight.clear();
}

/**
 * Drops cache entries starting with a specific prefix.
 */
export function invalidatePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

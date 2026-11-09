/**
 * A small in-memory cache for GET-shaped API calls, scoped to this browser tab's
 * lifetime — a plain module-level Map, nothing persisted, nothing shared across
 * tabs, gone on reload. Exists so that switching between pages, toggling a filter
 * back and forth, or a component remounting doesn't re-issue a request the app
 * already has a fresh-enough answer for sitting in memory: fewer round trips to
 * the backend, and revisiting something you were just looking at feels instant.
 *
 * Two things it does, both plain and deliberate:
 *  - Time-based freshness: an entry younger than its own TTL is served straight
 *    from memory, no network call at all.
 *  - In-flight de-duplication: two callers asking for the same key while a fetch
 *    for it is already in progress share that one fetch rather than issuing two.
 *
 * It does NOT try to be a fine-grained invalidation system — after any mutation
 * (revoking a device, creating a goal, editing a category, signing in/out) the
 * caller invalidates the whole thing rather than reasoning about which keys a
 * change could have touched. Clearing everything is cheap (it's just a Map) and
 * mutations are rare, deliberate user actions, so nothing here is hot enough to
 * need anything smarter.
 */

interface CacheEntry<T> {
  value: T;
  storedAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

export const DEFAULT_CACHE_TTL_MS = 60_000;

/** Returns the cached value for `key` if it's younger than `ttlMs`; otherwise calls
 * `fetcher()`, caches the result, and returns it. Concurrent calls for the same
 * `key` while a fetch is already in flight share that one promise. */
export function cachedFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = DEFAULT_CACHE_TTL_MS): Promise<T> {
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.storedAt < ttlMs) {
    return Promise.resolve(cached.value);
  }

  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, storedAt: Date.now() });
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, promise);
  return promise;
}

/** Stores a value directly — for a caller that fetched fresh data itself (a forced
 * reload bypassing the cache) but still wants the next cache-eligible read to see
 * it, instead of leaving a stale entry sitting there until its TTL expires. */
export function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, storedAt: Date.now() });
}

/** Drops every cached entry (and forgets any in-flight fetch's dedup registration —
 * a fetch already underway still resolves and stores its result normally, it's just
 * no longer joinable by a new caller). Call after any mutation and on sign-in/out —
 * see the module doc comment for why "clear everything" rather than per-key. */
export function invalidateAll(): void {
  cache.clear();
  inFlight.clear();
}

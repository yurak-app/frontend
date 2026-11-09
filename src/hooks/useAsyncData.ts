import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";
import { DEFAULT_CACHE_TTL_MS, getAnyCached, setCached } from "../utils/requestCache";

export interface UseAsyncDataOptions {
  /** Shown when the fetch throws something that isn't an `ApiError`. */
  fallbackErrorMessage?: string;
  /** Skip fetching entirely while false — e.g. before `token` is available. */
  enabled?: boolean;
  /**
   * Whether `loading` flips back to `true` when fetching without existing data.
   * If cached data is present, `loading` never flips back to true to avoid skeleton flashes.
   */
  showLoadingOnReload?: boolean;
  /**
   * Cache key for in-memory caching and instant SWR retrieval.
   */
  cacheKey?: string;
  /** How long a cached entry stays strictly fresh (default 60s). */
  cacheTtlMs?: number;
  /**
   * If true (default), revalidates in the background when cached data is shown (Stale-While-Revalidate).
   */
  revalidateInBackground?: boolean;
}

/**
 * High-performance data fetching hook with Stale-While-Revalidate (SWR) caching.
 *
 * Key features:
 *  - Synchronous cache hydration on mount: zero skeleton flash when navigating between pages.
 *  - Background server revalidation: updates UI silently without blocking page view.
 *  - Network resilience: keeps showing last good data if a background revalidation fails.
 *  - Manual reload: bypasses cache and syncs fresh state on demand.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options: UseAsyncDataOptions = {}
) {
  const {
    fallbackErrorMessage = "Something went wrong.",
    enabled = true,
    cacheKey,
    cacheTtlMs = DEFAULT_CACHE_TTL_MS,
    showLoadingOnReload = !cacheKey,
    revalidateInBackground = true,
  } = options;

  // 1. Synchronously resolve from in-memory cache on initial component render
  const initialCache = cacheKey ? getAnyCached<T>(cacheKey, cacheTtlMs) : undefined;

  const [data, setData] = useState<T | null>(initialCache ? initialCache.value : null);
  const [loading, setLoading] = useState(initialCache ? false : true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialCache ? initialCache.storedAt : null
  );

  // Keep a ref to the latest data so background fetch errors don't wipe existing screen data
  const dataRef = useRef(data);
  dataRef.current = data;

  const runFetch = useCallback(
    (useCache: boolean) => {
      if (!enabled) return Promise.resolve();

      // Check current cache state
      const currentCache = cacheKey ? getAnyCached<T>(cacheKey, cacheTtlMs) : undefined;

      if (currentCache) {
        // Immediate UI sync from cache (0ms transition)
        setData(currentCache.value);
        setLastUpdated(currentCache.storedAt);
        setLoading(false);

        // If fresh and not forcing revalidation, return immediately
        if (useCache && currentCache.isFresh && !revalidateInBackground) {
          return Promise.resolve();
        }
      } else {
        if (showLoadingOnReload) {
          setLoading(true);
        }
      }

      setFetching(true);
      setError(null);

      return fetcher()
        .then((result) => {
          if (cacheKey) {
            setCached(cacheKey, result);
          }
          setData(result);
          setLastUpdated(Date.now());
        })
        .catch((err) => {
          // Only show fatal error if there is zero data to display
          if (!currentCache && !dataRef.current) {
            setError(err instanceof ApiError ? err.message : fallbackErrorMessage);
          }
        })
        .finally(() => {
          setLoading(false);
          setFetching(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    deps
  );

  useEffect(() => {
    runFetch(true);
  }, [runFetch]);

  const reload = useCallback(() => runFetch(false), [runFetch]);

  return { data, setData, loading, fetching, error, setError, lastUpdated, reload };
}

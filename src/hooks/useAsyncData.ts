import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { cachedFetch, setCached } from "../utils/requestCache";

interface UseAsyncDataOptions {
  /** Shown when the fetch throws something that isn't an `ApiError`. */
  fallbackErrorMessage?: string;
  /** Skip fetching entirely while false — e.g. before `token` is available. */
  enabled?: boolean;
  /**
   * Whether `loading` flips back to `true` at the start of every fetch, not
   * just the first one. Pages that swap what they're looking at (a date, a
   * selected week) want that, so the old content doesn't sit there stale
   * while the new one loads. Pages that only ever silently resync the same
   * view (a manual "Sync" button) don't — flipping `loading` there would
   * blank the whole page out just to fetch what's already on screen; use
   * `fetching` for that instead. Default `true`.
   */
  showLoadingOnReload?: boolean;
  /**
   * When set, the automatic fetch (on mount, and whenever `deps` changes) is
   * served from the app-lifetime in-memory cache (`utils/requestCache.ts`) if a
   * fresh-enough entry already exists there, instead of always hitting the
   * backend — revisiting a page/filter combination you were just looking at
   * loads instantly and costs the backend nothing. A manually triggered
   * `reload()` always bypasses the cache and fetches fresh, then updates the
   * cache entry so the *next* automatic load sees that fresh result too.
   * Omit this to keep the old always-fetch behavior.
   */
  cacheKey?: string;
  /** How long a cached entry stays fresh — see requestCache's DEFAULT_CACHE_TTL_MS. */
  cacheTtlMs?: number;
}

/**
 * The load/error/loading/reload boilerplate almost every page and data panel
 * in this app repeats: fetch on mount (and whenever `deps` changes), track
 * loading/error state, and expose a `reload` for both mutations that need to
 * resync with server truth and a user-triggered "Sync" button. `data` is
 * whatever shape `fetcher` resolves to — often one combined object from a
 * `Promise.all` of several endpoints, so a page still gets one `data` to read
 * from instead of juggling a separate `useState` per endpoint.
 *
 * Deliberately doesn't poll on an interval — this app used to, silently
 * re-fetching every 30s, but that meant hitting the backend on a timer
 * whether or not anyone was looking, with no way to tell how fresh what's on
 * screen actually is. `lastUpdated` plus a manual `reload()` (wired to a
 * visible "Sync" button — see `SyncBar`) replaces that: data loads once and
 * stays put until you ask for it again, honestly labeled with its own age.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options: UseAsyncDataOptions = {}
) {
  const {
    fallbackErrorMessage = "Something went wrong.",
    enabled = true,
    showLoadingOnReload = true,
    cacheKey,
    cacheTtlMs,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const runFetch = useCallback(
    (useCache: boolean) => {
      if (!enabled) return Promise.resolve();
      if (showLoadingOnReload) setLoading(true);
      setFetching(true);
      setError(null);

      const resultPromise =
        cacheKey && useCache
          ? cachedFetch(cacheKey, fetcher, cacheTtlMs)
          : fetcher().then((result) => {
              if (cacheKey) setCached(cacheKey, result); // keep the next cache-eligible read in sync with this forced fetch
              return result;
            });

      return resultPromise
        .then((result) => {
          setData(result);
          setLastUpdated(Date.now());
        })
        .catch((err) => setError(err instanceof ApiError ? err.message : fallbackErrorMessage))
        .finally(() => {
          setLoading(false);
          setFetching(false);
        });
      // `deps` is the caller's own dependency list (usually `token` plus whatever
      // the fetcher closes over) — it drives when a *new* fetch should run, which
      // is exactly what useCallback's own list is for.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    deps
  );

  useEffect(() => {
    runFetch(true);
  }, [runFetch]);

  // Stable as long as `runFetch` itself is (i.e. as long as `deps` hasn't changed) —
  // matches the old behavior, where this was literally the same callback as the
  // mount/deps-change effect above.
  const reload = useCallback(() => runFetch(false), [runFetch]);

  return { data, setData, loading, fetching, error, setError, lastUpdated, reload };
}

import { useEffect, useState } from "react";

/**
 * Forces a re-render every `intervalMs` — purely local, no network calls.
 * Relative-time text ("Updated 2m ago") is computed from a stored timestamp
 * at render time, so without this it would silently go stale between
 * whatever renders happen to occur next; this just makes sure one comes
 * around on its own.
 */
export function useNowTick(intervalMs: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

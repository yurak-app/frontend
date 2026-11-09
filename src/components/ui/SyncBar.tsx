import { RefreshCw } from "lucide-react";
import { formatRelativeTime } from "../../utils/format";
import { useNowTick } from "../../hooks/useNowTick";

/**
 * Replaces silent background polling: data loads once and sits there until
 * you ask for it again, so this is what tells you how stale it is and lets
 * you pull a fresh copy on demand instead.
 */
export function SyncBar({
  lastUpdated,
  syncing,
  onSync,
}: {
  lastUpdated: number | null;
  syncing: boolean;
  onSync: () => void;
}) {
  useNowTick(60_000); // keep "Updated Xm ago" from going stale while the page just sits there

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs text-muted tabular-nums">
        {lastUpdated ? `Updated ${formatRelativeTime(new Date(lastUpdated).toISOString())}` : ""}
      </span>
      <button
        type="button"
        onClick={onSync}
        disabled={syncing}
        className="p-1.5 rounded-full border border-border text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
        aria-label="Sync now"
        title="Sync now"
      >
        <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
      </button>
    </div>
  );
}

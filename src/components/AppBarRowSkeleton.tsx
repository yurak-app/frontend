import { Skeleton } from "./ui/Skeleton";

/** Loading placeholder for one `AppBarRow` — same `[120px_1fr_52px]` grid, so
 * lists that render `AppBarRow` (the dashboard's "Today" panel, the day-activity
 * dialog) can show a shimmering stand-in shaped exactly like what replaces it. */
export function AppBarRowSkeleton({ barWidth }: { barWidth: number }) {
  return (
    <div className="grid grid-cols-[120px_1fr_52px] items-center gap-3 py-1.5">
      <Skeleton style={{ width: 90 }} />
      <Skeleton className="rounded" style={{ height: 8, width: `${barWidth}%` }} />
      <Skeleton style={{ width: 36 }} />
    </div>
  );
}

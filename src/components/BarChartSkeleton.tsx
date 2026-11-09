import { Skeleton } from "./ui/Skeleton";

const BAR_HEIGHTS = [40, 65, 30, 80, 55, 45, 70];

/** Loading placeholder shaped like a 7-bar week chart (`WeeklyBarChart`) — used
 * by both the dashboard and the weekly report, which render that same chart. */
export function BarChartSkeleton() {
  return (
    <div className="flex items-end gap-2.5 h-[140px] pt-7">
      {BAR_HEIGHTS.map((height, i) => (
        <div className="flex-1 flex flex-col items-center h-full justify-end gap-2" key={i}>
          <Skeleton className="rounded w-full max-w-8" style={{ height: `${height}%` }} />
          <Skeleton style={{ width: 20, height: 10 }} />
        </div>
      ))}
    </div>
  );
}

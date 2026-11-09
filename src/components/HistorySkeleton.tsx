import { Skeleton } from "./ui/Skeleton";

const CAL_COLS = 26; // half as many columns as the real 52-week grid — plenty to read as "a calendar" without 350+ shimmering nodes
const CAL_CELL = 13;
const CAL_GAP = 3;
const HOUR_COLS = 24;

/** Loading placeholder for `DayCalendarHeatmap` — same weekday-label column +
 * grid-of-squares + legend shape, so the panel doesn't jump when real data lands. */
export function CalendarHeatmapSkeleton() {
  return (
    <div>
      <div className="inline-flex flex-col gap-1.5">
        <div className="flex" style={{ gap: CAL_GAP, paddingLeft: 30 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} style={{ width: 24, height: 9, marginRight: 60 }} />
          ))}
        </div>
        <div className="flex" style={{ gap: CAL_GAP }}>
          <div className="flex flex-col shrink-0" style={{ gap: CAL_GAP, width: 26 }}>
            {["Mon", "", "Wed", "", "Fri", "", ""].map((label, i) => (
              <div key={i} style={{ height: CAL_CELL }} className="flex items-center">
                {label && <Skeleton style={{ width: 20, height: 9 }} />}
              </div>
            ))}
          </div>
          {Array.from({ length: CAL_COLS }, (_, w) => (
            <div key={w} className="flex flex-col" style={{ gap: CAL_GAP }}>
              {Array.from({ length: 7 }, (_, d) => (
                <Skeleton key={d} className="rounded-sm" style={{ width: CAL_CELL, height: CAL_CELL }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
        <Skeleton style={{ width: 140, height: 11 }} />
        <div className="flex items-center gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="rounded-sm" style={{ width: 10, height: 10 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Loading placeholder for `HourlyHeatmapChart` — the same 7×24 grid shape. */
export function HourlyHeatmapSkeleton() {
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `30px repeat(${HOUR_COLS}, 1fr)` }}>
        <div />
        {Array.from({ length: HOUR_COLS }, (_, h) => (
          <div key={`h-${h}`} />
        ))}
        {Array.from({ length: 7 }, (_, weekday) => (
          <div className="contents" key={weekday}>
            <div className="flex items-center" style={{ height: 14 }}>
              <Skeleton style={{ width: 20, height: 9 }} />
            </div>
            {Array.from({ length: HOUR_COLS }, (_, hour) => (
              <Skeleton key={hour} className="aspect-square rounded-sm" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="rounded-sm" style={{ width: 10, height: 10 }} />
        ))}
      </div>
    </div>
  );
}

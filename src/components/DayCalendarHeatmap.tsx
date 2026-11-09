import { useState } from "react";
import { addDays, formatDateOnly, parseDateOnly, today } from "../utils/dates";
import { formatDuration } from "../utils/format";

const CELL = 13; // px — square size and gap unit shared by the grid and its label rows
const GAP = 3;

// Every other row labeled (Mon/Wed/Fri), same convention GitHub's own
// contributions graph uses — enough to orient by without a label on every row.
const WEEKDAY_ROW_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

const LEGEND_STEPS = [0, 0.1, 0.3, 0.5, 0.7, 1];

function intensityClass(fraction: number): string {
  if (fraction <= 0) return "bg-border/50";
  if (fraction < 0.2) return "bg-accent/20";
  if (fraction < 0.4) return "bg-accent/40";
  if (fraction < 0.6) return "bg-accent/60";
  if (fraction < 0.8) return "bg-accent/80";
  return "bg-accent";
}

/**
 * GitHub-contributions-style grid: one column per week, one row per weekday,
 * colored by that day's total — the same sequential single-hue rule as the
 * hourly heatmap, just for "how much per day" over months instead of "when".
 * Month labels above the columns and a color legend below are what make a
 * bare grid of squares actually readable without already knowing the convention.
 */
export function DayCalendarHeatmap({
  gridStart,
  weeks,
  totalsByDate,
  onSelectDate,
}: {
  gridStart: Date;
  weeks: number;
  totalsByDate: Map<string, number>;
  onSelectDate: (date: string) => void;
}) {
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const max = Math.max(1, ...totalsByDate.values());
  const todayStr = formatDateOnly(today());

  const columns = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => formatDateOnly(addDays(gridStart, w * 7 + d)))
  );

  // A month label above a column only when that week starts a new month
  // compared to the previous column — so the grid reads as a real (if
  // compressed) calendar instead of an undifferentiated block of squares.
  const monthLabels = columns.map((column, w) => {
    const weekStart = parseDateOnly(column[0]);
    if (w === 0) return weekStart.toLocaleDateString(undefined, { month: "short" });
    const prevWeekStart = parseDateOnly(columns[w - 1][0]);
    return weekStart.getMonth() !== prevWeekStart.getMonth()
      ? weekStart.toLocaleDateString(undefined, { month: "short" })
      : "";
  });

  const hoverLabel = hoverDate
    ? `${parseDateOnly(hoverDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · ${formatDuration(
        totalsByDate.get(hoverDate) ?? 0
      )}`
    : "Click a day to see what you used";

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1.5">
          <div className="flex" style={{ gap: GAP, paddingLeft: 30 }}>
            {monthLabels.map((label, w) => (
              <div key={w} className="text-[9px] text-muted shrink-0" style={{ width: CELL }}>
                {label}
              </div>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            {/* Sticky to the scroll container below, not the page — stays put as
                you scroll a year's worth of columns instead of scrolling away
                with them. Needs its own opaque background so squares scrolling
                underneath don't show through. */}
            <div className="flex flex-col shrink-0 sticky left-0 bg-surface z-10" style={{ gap: GAP, width: 26 }}>
              {WEEKDAY_ROW_LABELS.map((label, i) => (
                <div key={i} className="text-[9px] text-muted flex items-center" style={{ height: CELL }}>
                  {label}
                </div>
              ))}
            </div>

            {columns.map((column, w) => (
              <div key={w} className="flex flex-col" style={{ gap: GAP }}>
                {column.map((date) => {
                  const seconds = totalsByDate.get(date) ?? 0;
                  const isFuture = date > todayStr;
                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={isFuture || seconds === 0}
                      onClick={() => onSelectDate(date)}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`rounded-sm border-none p-0 cursor-pointer disabled:cursor-default transition-[background-color,transform] duration-300 hover:scale-110 ${
                        isFuture ? "bg-transparent" : intensityClass(seconds / max)
                      }`}
                      style={{ width: CELL, height: CELL }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
        <p className="text-xs text-muted m-0">{hoverLabel}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted shrink-0">
          Less
          {LEGEND_STEPS.map((fraction, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-sm ${intensityClass(fraction)}`} />
          ))}
          More
        </div>
      </div>
    </div>
  );
}

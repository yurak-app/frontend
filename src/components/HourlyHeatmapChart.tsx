import { Fragment } from "react";
import { formatDuration } from "../utils/format";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
 * 7x24 grid (weekday x hour-of-day), colored by usage intensity — a single
 * sequential hue for magnitude, same rule used everywhere else in the app.
 * Answers "when do I use my computer", a different question than "how much".
 * Each cell carries its own hover tooltip (CSS group-hover, no JS state) —
 * simpler than one shared caption line, and the info sits right where you're
 * pointing instead of your eyes having to jump to a line below the grid.
 */
export function HourlyHeatmapChart({ cells }: { cells: number[][] }) {
  const max = Math.max(1, ...cells.flat());

  return (
    <div>
      {/* `grid` (not `inline-grid`) + plain `1fr` columns — always fills and
          never exceeds the container's own width, so this never needs to
          scroll regardless of viewport size, unlike a fixed per-cell minimum. */}
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: "30px repeat(24, 1fr)" }}>
        <div />
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={`h-${hour}`} className="text-[8px] text-muted text-center">
            {hour % 3 === 0 ? hour : ""}
          </div>
        ))}
        {cells.map((row, weekday) => (
          <Fragment key={weekday}>
            <div className="text-[10px] text-muted flex items-center">{WEEKDAY_LABELS[weekday]}</div>
            {row.map((seconds, hour) => (
              <div key={hour} className="relative group">
                <div
                  className={`aspect-square rounded-sm cursor-default transition-[background-color,transform] duration-300 hover:scale-110 ${intensityClass(seconds / max)}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-ink text-bg text-[10px] font-semibold px-1.5 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {WEEKDAY_LABELS[weekday]} {hour}:00-{hour + 1}:00 - {formatDuration(seconds)}
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 text-[10px] text-muted mt-2">
        Less
        {LEGEND_STEPS.map((fraction, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-sm ${intensityClass(fraction)}`} />
        ))}
        More
      </div>
    </div>
  );
}

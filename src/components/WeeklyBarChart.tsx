import { useState } from "react";
import { weekdayLabel } from "../utils/dates";
import { formatDuration } from "../utils/format";

const WIDTH = 640;
const HEIGHT = 200;
const PAD = { top: 14, right: 26, bottom: 24, left: 8 };
const INNER_WIDTH = WIDTH - PAD.left - PAD.right;
const INNER_HEIGHT = HEIGHT - PAD.top - PAD.bottom;
const GAP = 10;
const BAR_WIDTH = (INNER_WIDTH - GAP * 6) / 7;
const BAR_RADIUS = 4;

interface DayPoint {
  date: string;
  totalSeconds: number;
}

/** A bar anchored to the baseline, rounded only on the end away from it — per the
 * usual mark spec for this kind of chart (the baseline-touching edge stays square). */
function barPath(x: number, top: number, bottom: number): string {
  const r = Math.min(BAR_RADIUS, BAR_WIDTH / 2, Math.max(0, bottom - top));
  return `M ${x} ${bottom} L ${x} ${top + r} Q ${x} ${top} ${x + r} ${top} L ${x + BAR_WIDTH - r} ${top} Q ${x + BAR_WIDTH} ${top} ${x + BAR_WIDTH} ${top + r} L ${x + BAR_WIDTH} ${bottom} Z`;
}

/**
 * This week's daily totals (accent bars) against the trailing-4-week average for
 * each weekday (hatched band behind them) and this week's own daily average
 * (dashed line) — the same shape as a phone's "screen time by week" report.
 */
export function WeeklyBarChart({
  days,
  baseline,
  avgSeconds,
}: {
  days: DayPoint[];
  baseline: number[];
  avgSeconds: number;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxSeconds = Math.max(1, avgSeconds, ...days.map((d) => d.totalSeconds), ...baseline);
  const maxHours = Math.max(1, Math.ceil(maxSeconds / 3600));
  const scaleY = (seconds: number) => PAD.top + (1 - Math.min(1, seconds / (maxHours * 3600))) * INNER_HEIGHT;
  const baseY = PAD.top + INNER_HEIGHT;
  const xFor = (i: number) => PAD.left + i * (BAR_WIDTH + GAP);
  const xCenterFor = (i: number) => xFor(i) + BAR_WIDTH / 2;

  const baselinePath =
    `M ${xCenterFor(0)} ${scaleY(baseline[0])} ` +
    baseline
      .slice(1)
      .map((v, i) => `L ${xCenterFor(i + 1)} ${scaleY(v)}`)
      .join(" ") +
    ` L ${xCenterFor(6)} ${baseY} L ${xCenterFor(0)} ${baseY} Z`;

  const gridHours = maxHours >= 2 ? [Math.round(maxHours / 2), maxHours] : [maxHours];
  const avgY = scaleY(avgSeconds);
  const hovered = hoverIndex !== null ? days[hoverIndex] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block">
        <defs>
          <pattern id="weeklyHatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-border" strokeWidth={2} />
          </pattern>
        </defs>

        {/* gridlines */}
        {gridHours.map((h) => (
          <line
            key={h}
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={scaleY(h * 3600)}
            y2={scaleY(h * 3600)}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}
        {gridHours.map((h) => (
          <text key={h} x={WIDTH - PAD.right + 5} y={scaleY(h * 3600) + 3} className="fill-muted text-[9px]">
            {h}h
          </text>
        ))}

        {/* trailing-4-week baseline, per weekday */}
        <path d={baselinePath} fill="url(#weeklyHatch)" />

        {/* this week's own daily average */}
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={avgY}
          y2={avgY}
          className="stroke-muted"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <rect x={WIDTH - PAD.right - 32} y={avgY - 9} width={32} height={16} rx={8} className="fill-ink" />
        <text x={WIDTH - PAD.right - 16} y={avgY + 3} textAnchor="middle" className="fill-bg text-[9px] font-semibold">
          Avg
        </text>

        {/* bars */}
        {days.map((day, i) => (
          <g key={day.date} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
            <rect x={xFor(i)} y={PAD.top} width={BAR_WIDTH} height={INNER_HEIGHT} fill="transparent" />
            <path
              d={barPath(xFor(i), scaleY(day.totalSeconds), baseY)}
              className={`fill-accent transition-opacity ${hoverIndex === i ? "opacity-75" : ""}`}
            />
            <text x={xCenterFor(i)} y={HEIGHT - 6} textAnchor="middle" className="fill-muted text-[10px]">
              {weekdayLabel(day.date)[0]}
            </text>
          </g>
        ))}
      </svg>

      {hovered && (
        <div
          className="absolute top-0 -translate-x-1/2 pointer-events-none bg-ink text-bg text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-sm"
          style={{ left: `${(xCenterFor(hoverIndex!) / WIDTH) * 100}%` }}
        >
          {weekdayLabel(hovered.date)} · {formatDuration(hovered.totalSeconds)}
        </div>
      )}
    </div>
  );
}

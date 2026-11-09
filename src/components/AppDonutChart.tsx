import { useState } from "react";
import { AppIcon } from "./ui/AppIcon";
import { formatDuration } from "../utils/format";
import type { AppShareSlice } from "../utils/chartColors";

const SIZE = 180;
const STROKE = 34;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
// Just outside the ring's own outer edge, so the tooltip never sits on top of
// the arc it's describing.
const TOOLTIP_RADIUS = RADIUS + STROKE / 2 + 4;

function polarPoint(angleDeg: number, radius: number = RADIUS) {
  const rad = ((angleDeg - 90) * Math.PI) / 180; // 0deg = 12 o'clock, increasing = clockwise
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

/** An explicit arc path per slice — not stacked full-circle strokes carved up
 * with stroke-dasharray/-dashoffset. That approach looked right on paper but
 * rendered with a visible gouged-out wedge in practice (browsers don't
 * reliably rasterize N overlapping dash patterns on identical circle
 * geometry as one seamless ring), so this draws each slice as its own
 * independent, unambiguous arc instead. */
function arcPath(startDeg: number, endDeg: number): string {
  const start = polarPoint(startDeg);
  const end = polarPoint(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/**
 * Part-to-whole at a glance only (per the dataviz method: a donut is wrong for
 * *comparing* close values — that's what the exact bar list next to this view
 * is for). Capped at the 5 categorical slots + "Other" so it never asks a
 * reader to tell apart a generated 6th+ hue.
 */
export function AppDonutChart({ slices, total }: { slices: AppShareSlice[]; total: number }) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  // Fractions come from the slices' own total, not the `total` prop — the
  // ring always sums to exactly 100% by construction, with no way for it to
  // silently drift out of sync with whatever total the caller happens to pass.
  const sliceTotal = slices.reduce((sum, s) => sum + s.seconds, 0);

  let cursor = 0;
  const arcs = slices
    .filter((slice) => slice.seconds > 0)
    .map((slice) => {
      const fraction = sliceTotal > 0 ? slice.seconds / sliceTotal : 0;
      const startDeg = cursor * 360;
      cursor += fraction;
      const endDeg = cursor * 360;
      return { slice, startDeg, endDeg, fraction, midDeg: startDeg + (endDeg - startDeg) / 2 };
    });
  const hovered = arcs.find((arc) => arc.slice.key === hoverKey) ?? null;
  const tooltipPoint = hovered ? polarPoint(hovered.midDeg, TOOLTIP_RADIUS) : null;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" className="stroke-border" strokeWidth={STROKE} />
          {arcs.length === 1 ? (
            // A single 100% slice can't be drawn as one arc (its start and end
            // point coincide, which SVG treats as zero-length) — a plain full
            // circle is the correct shape here anyway.
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              className={arcs[0].slice.strokeClass}
              strokeWidth={STROKE}
              onMouseEnter={() => setHoverKey(arcs[0].slice.key)}
              onMouseLeave={() => setHoverKey(null)}
            />
          ) : (
            arcs.map(({ slice, startDeg, endDeg }) => (
              <path
                key={slice.key}
                d={arcPath(startDeg, endDeg)}
                fill="none"
                className={slice.strokeClass}
                strokeWidth={STROKE}
                onMouseEnter={() => setHoverKey(slice.key)}
                onMouseLeave={() => setHoverKey(null)}
              />
            ))
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold tabular-nums">{formatDuration(total)}</span>
          <span className="text-[0.7rem] text-muted mt-0.5">today</span>
        </div>

        {hovered && tooltipPoint && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 bg-ink text-bg text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{ left: tooltipPoint.x, top: tooltipPoint.y }}
          >
            {hovered.slice.label} · {Math.round(hovered.fraction * 100)}%
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2 text-xs min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${slice.colorClass}`} />
            {slice.appId && <AppIcon appId={slice.appId} identifier={slice.identifier} platform={slice.platform} size={14} />}
            <span className="flex-1 min-w-0 truncate">{slice.label}</span>
            <span className="text-muted tabular-nums shrink-0">{formatDuration(slice.seconds)}</span>
            <span className="text-muted tabular-nums shrink-0 w-9 text-right">
              {sliceTotal > 0 ? Math.round((slice.seconds / sliceTotal) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { AppIcon } from "./ui/AppIcon";
import { formatDuration } from "../utils/format";
import type { AppShareSlice } from "../utils/chartColors";

/**
 * A single 100%-stacked bar — the dataviz method's actual default form for
 * part-to-whole (a donut is the "at a glance only" alternative next to it).
 * Easier to compare two close shares on than arcs are.
 */
export function AppShareBar({ slices, total }: { slices: AppShareSlice[]; total: number }) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  let cursor = 0;
  const segments = slices.map((slice, i) => {
    const pct = total > 0 ? (slice.seconds / total) * 100 : 0;
    const mid = cursor + pct / 2;
    cursor += pct;
    return { slice, pct, mid, isFirst: i === 0, isLast: i === slices.length - 1 };
  });
  const hovered = segments.find((s) => s.slice.key === hoverKey) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="flex h-4 gap-0.5">
          {segments.map(({ slice, pct, isFirst, isLast }) => (
            <div
              key={slice.key}
              className={`${slice.colorClass} min-w-[3px] ${isFirst ? "rounded-l-full" : ""} ${isLast ? "rounded-r-full" : ""}`}
              style={{ width: `${pct}%` }}
              onMouseEnter={() => setHoverKey(slice.key)}
              onMouseLeave={() => setHoverKey(null)}
            />
          ))}
        </div>

        {hovered && (
          <div
            className="absolute bottom-full -translate-x-1/2 mb-1.5 bg-ink text-bg text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{ left: `${hovered.mid}%` }}
          >
            {hovered.slice.label} · {Math.round(hovered.pct)}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2 text-xs min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${slice.colorClass}`} />
            {slice.appId && <AppIcon appId={slice.appId} identifier={slice.identifier} platform={slice.platform} size={14} />}
            <span className="flex-1 min-w-0 truncate">{slice.label}</span>
            <span className="text-muted tabular-nums shrink-0">{formatDuration(slice.seconds)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

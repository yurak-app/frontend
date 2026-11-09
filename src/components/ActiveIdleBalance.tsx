import { useState } from "react";
import { formatDuration } from "../utils/format";

type Hover = "active" | "idle" | "charging" | null;

/**
 * A proportion bar (active vs idle) with a hover tooltip on each segment, plus
 * bold active/idle numbers below — no "Active"/"Idle" word labels, just a
 * colored dot next to each number, the bar itself carrying the rest. Shared
 * between the dashboard's "Balance" panel (a single day, optionally with a
 * charging overlay) and the weekly report's (a daily average, no charging
 * data) — same shape either way, so one component instead of two near-copies.
 */
export function ActiveIdleBalance({
  activeSeconds,
  idleSeconds,
  chargingSeconds = 0,
}: {
  activeSeconds: number;
  idleSeconds: number;
  chargingSeconds?: number;
}) {
  const [hover, setHover] = useState<Hover>(null);

  const trackedSeconds = Math.max(1, activeSeconds + idleSeconds);
  const activeSharePct = (activeSeconds / trackedSeconds) * 100;
  const chargingShareOfActivePct = activeSeconds > 0 ? Math.min(100, (chargingSeconds / activeSeconds) * 100) : 0;
  // The charging overlay's own width is a % *of the active segment*, not of
  // the whole bar, so its bar-relative position has to be re-derived here too.
  const chargingWidthPct = (chargingShareOfActivePct / 100) * activeSharePct;
  const midPct = {
    active: activeSharePct / 2,
    charging: activeSharePct - chargingWidthPct / 2,
    idle: activeSharePct + (100 - activeSharePct) / 2,
  };

  return (
    <div>
      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden">
          <div
            className="relative bg-accent min-w-[3px] transition-[width] duration-500 ease-out"
            style={{ width: `${activeSharePct}%` }}
            onMouseEnter={() => setHover("active")}
            onMouseLeave={() => setHover(null)}
          >
            {chargingSeconds > 0 && (
              <div
                className="absolute inset-y-0 right-0 opacity-40 transition-[width] duration-500 ease-out"
                style={{
                  width: `${chargingShareOfActivePct}%`,
                  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.95) 0 2px, transparent 2px 5px)",
                }}
                onMouseEnter={() => setHover("charging")}
                onMouseLeave={() => setHover("active")}
              />
            )}
          </div>
          <div
            className="bg-border min-w-[3px] transition-[width] duration-500 ease-out"
            style={{ width: `${100 - activeSharePct}%` }}
            onMouseEnter={() => setHover("idle")}
            onMouseLeave={() => setHover(null)}
          />
        </div>

        {hover && (
          <div
            className="absolute bottom-full -translate-x-1/2 mb-1.5 bg-ink text-bg text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
            style={{ left: `${midPct[hover]}%` }}
          >
            {hover === "active" && `Active · ${Math.round(activeSharePct)}%`}
            {hover === "charging" && `On charger ${formatDuration(chargingSeconds)} · ${Math.round(chargingShareOfActivePct)}% of active`}
            {hover === "idle" && `Idle · ${Math.round(100 - activeSharePct)}%`}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
          <span className="text-lg font-bold tabular-nums">{formatDuration(activeSeconds)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tabular-nums">{formatDuration(idleSeconds)}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-border shrink-0" />
        </div>
      </div>
    </div>
  );
}

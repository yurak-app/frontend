import { useEffect, useMemo, useRef, useState } from "react";
import { BatteryCharging } from "lucide-react";
import { getBatteryHistory, type BatteryReading, type Device } from "../api/client";
import { formatDateOnly, parseDateOnly, today } from "../utils/dates";
import { formatTime } from "../utils/format";
import { useAsyncData } from "../hooks/useAsyncData";
import { Panel } from "./ui/Panel";
import { PanelHeading } from "./ui/PanelHeading";
import { EmptyState } from "./ui/EmptyState";
import { Skeleton } from "./ui/Skeleton";

const WIDTH = 680;
const HEIGHT = 170;
const PAD = { top: 10, right: 10, bottom: 22, left: 30 };
const INNER_WIDTH = WIDTH - PAD.left - PAD.right;
const INNER_HEIGHT = HEIGHT - PAD.top - PAD.bottom;

// The backend only writes a reading row on change, or at minimum every 15min
// as a heartbeat (see devices.service.updateBatteryStatus) — so a legitimate
// gap between two rows while the agent is running and the battery just isn't
// moving can be up to ~15min. Anything bigger than that is a real gap (agent
// closed/offline), treated as a separate run rather than bridged across.
const GAP_MS = 20 * 60 * 1000;

/** Either an actual reading (hovering a real data point) or an interpolated
 * point somewhere along a gap connector — the two points bounding that gap
 * are known, so a plausible in-between level is a straight linear blend, not
 * "no information at all" (still labeled as an estimate, not fact, though). */
type HoverInfo =
  | { kind: "reading"; reading: BatteryReading }
  | { kind: "gap"; ms: number; level: number };

function dayBoundsMs(date: string) {
  const start = parseDateOnly(date).getTime();
  return { start, end: start + 24 * 60 * 60 * 1000 };
}

function splitIntoRuns(readings: BatteryReading[]): BatteryReading[][] {
  const runs: BatteryReading[][] = [];
  let current: BatteryReading[] = [];
  let prevMs: number | null = null;
  for (const r of readings) {
    const ms = new Date(r.recordedAt).getTime();
    if (prevMs !== null && ms - prevMs > GAP_MS) {
      runs.push(current);
      current = [];
    }
    current.push(r);
    prevMs = ms;
  }
  if (current.length > 0) runs.push(current);
  return runs;
}

/**
 * Step path (not a diagonal line) — readings are only logged on change, so a
 * reading is the level holding constant *from* that timestamp until the next
 * one, not a sample on a continuously-interpolated curve. A straight line
 * between two readings 40 minutes apart would draw a slope that never
 * happened; a step says exactly what's known: flat, then a jump.
 */
function buildStepPath(run: BatteryReading[], scaleX: (iso: string) => number, scaleY: (level: number) => number): string {
  let d = `M ${scaleX(run[0].recordedAt)} ${scaleY(run[0].level)}`;
  let prevY = scaleY(run[0].level);
  for (const r of run.slice(1)) {
    const x = scaleX(r.recordedAt);
    const y = scaleY(r.level);
    d += ` L ${x} ${prevY} L ${x} ${y}`;
    prevY = y;
  }
  return d;
}

/** Battery-level-over-time chart, sourced from the full battery_readings history
 * (not just the live snapshot) — for whichever day the dashboard is currently
 * showing, not hardcoded to today. */
export function BatteryHistoryPanel({ token, devices, date }: { token: string | null; devices: Device[]; date: string }) {
  // `platform !== "extension"` is belt-and-suspenders, not load-bearing — a browser
  // extension has no battery to report in the first place, so `batteryLevel` is
  // already always null for one and this filter would exclude it either way. Explicit
  // here because "device" is ambiguous for a browser: it's not a separate physical
  // machine with its own battery, just another view onto whatever machine the
  // browser (and possibly the Windows agent) is already running on.
  const batteryDevices = useMemo(
    () => devices.filter((d) => !d.revokedAt && d.platform !== "extension" && d.batteryLevel !== null),
    [devices]
  );

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const deviceId = selectedDeviceId ?? batteryDevices[0]?.id ?? null;
  const isToday = date === formatDateOnly(today());

  const { data, loading, error } = useAsyncData<BatteryReading[]>(
    () => getBatteryHistory(token!, date, deviceId!).then((res) => res.readings),
    [token, deviceId, date],
    {
      enabled: !!token && !!deviceId,
      fallbackErrorMessage: "Couldn't load battery history.",
      cacheKey: deviceId ? `battery:${deviceId}:${date}` : undefined,
    }
  );
  const readings = data ?? [];

  // Hovering a point on one day's chart shouldn't still be "pointing at"
  // something once the day underneath it has changed.
  useEffect(() => setHover(null), [date]);

  function selectDevice(id: string) {
    setHover(null);
    setSelectedDeviceId(id);
  }

  if (batteryDevices.length === 0) return null;

  const { start: dayStart, end: dayEnd } = dayBoundsMs(date);
  const scaleXMs = (ms: number) => PAD.left + ((ms - dayStart) / (dayEnd - dayStart)) * INNER_WIDTH;
  const scaleX = (iso: string) => scaleXMs(new Date(iso).getTime());
  const scaleY = (level: number) => PAD.top + (1 - level / 100) * INNER_HEIGHT;

  const runs = splitIntoRuns(readings);
  const linePaths = runs.filter((run) => run.length > 1).map((run) => buildStepPath(run, scaleX, scaleY));

  // A gray straight-line bridge across each gap between runs (agent closed/offline) —
  // not a step, and not colored like real data: it's honestly just "level went from
  // A to B sometime in here, unknown how," not a claim about what actually happened.
  const gapConnectors = runs.slice(1).map((run, i) => {
    const prevRun = runs[i];
    const from = prevRun[prevRun.length - 1];
    const to = run[0];
    return { key: `gap-${from.id}-${to.id}`, x1: scaleX(from.recordedAt), y1: scaleY(from.level), x2: scaleX(to.recordedAt), y2: scaleY(to.level) };
  });

  const chargingBands = runs.flatMap((run) =>
    run.slice(0, -1).flatMap((r, i) =>
      r.isCharging
        ? [{ x1: scaleX(r.recordedAt), x2: scaleX(run[i + 1].recordedAt), key: `${r.id}` }]
        : []
    )
  );

  const ticks = [0, 6, 12, 18, 24].map((h) => {
    // `h` runs 0-24 (midnight to midnight-next-day), so wrap 24 back to the
    // hour-of-day 0 for labeling — without this, 24 fell into the "pm" branch
    // and read "12pm", duplicating noon's label instead of showing midnight.
    const hourOfDay = h % 24;
    const label = hourOfDay === 0 ? "12am" : hourOfDay === 12 ? "12pm" : hourOfDay < 12 ? `${hourOfDay}am` : `${hourOfDay - 12}pm`;
    return { x: PAD.left + (h / 24) * INNER_WIDTH, label };
  });

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || readings.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    // rect.width is the SVG's *rendered* CSS pixel width, which only equals
    // the 0-680 viewBox width by coincidence — scale mouse position into
    // viewBox units first, then subtract the left plot margin, so fraction 0
    // lands exactly on PAD.left (the "12am" tick), not on the SVG's own
    // left edge. Skipping that scale/offset was the earlier bug: the plot
    // area is narrower than the full SVG box, so treating the whole box as
    // the data range works out about right near wherever the two ranges
    // happen to cross, and drifts further off the further you are from that
    // point — worst right at the edges.
    const scale = rect.width / WIDTH;
    const xInViewBox = (e.clientX - rect.left) / scale;
    const fraction = Math.min(1, Math.max(0, (xInViewBox - PAD.left) / INNER_WIDTH));
    const targetMs = dayStart + fraction * (dayEnd - dayStart);

    // Inside a gap between runs? Interpolate between its two boundary readings
    // instead of snapping to whichever real reading happens to be nearest.
    for (let i = 1; i < runs.length; i++) {
      const from = runs[i - 1][runs[i - 1].length - 1];
      const to = runs[i][0];
      const fromMs = new Date(from.recordedAt).getTime();
      const toMs = new Date(to.recordedAt).getTime();
      if (targetMs >= fromMs && targetMs <= toMs) {
        const t = toMs > fromMs ? (targetMs - fromMs) / (toMs - fromMs) : 0;
        setHover({ kind: "gap", ms: targetMs, level: from.level + (to.level - from.level) * t });
        return;
      }
    }

    // Otherwise, the nearest real reading by time — binary search since
    // readings are sorted ascending.
    let lo = 0;
    let hi = readings.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (new Date(readings[mid].recordedAt).getTime() < targetMs) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0) {
      const prevDiff = Math.abs(new Date(readings[lo - 1].recordedAt).getTime() - targetMs);
      const curDiff = Math.abs(new Date(readings[lo].recordedAt).getTime() - targetMs);
      if (prevDiff < curDiff) lo -= 1;
    }
    setHover({ kind: "reading", reading: readings[lo] });
  }

  const hoverX = hover ? (hover.kind === "reading" ? scaleX(hover.reading.recordedAt) : scaleXMs(hover.ms)) : null;
  const hoverY = hover ? scaleY(hover.kind === "reading" ? hover.reading.level : hover.level) : null;

  return (
    <Panel>
      <PanelHeading icon={BatteryCharging}>Battery history</PanelHeading>

      {batteryDevices.length > 1 && (
        <div className="flex gap-1.5 mb-4 -mt-2">
          {batteryDevices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => selectDevice(d.id)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                d.id === deviceId
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {loading && <Skeleton className="rounded-xl w-full" style={{ height: HEIGHT }} />}
      {error && <p className="text-danger text-sm m-0">{error}</p>}
      {!loading && !error && readings.length === 0 && <EmptyState>No battery data for {isToday ? "today" : "this day"}.</EmptyState>}

      {!loading && !error && readings.length > 0 && (
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto block"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          >
            {/* gridlines */}
            {[0, 25, 50, 75, 100].map((level) => (
              <line
                key={level}
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={scaleY(level)}
                y2={scaleY(level)}
                className="stroke-border"
                strokeWidth={1}
              />
            ))}
            {[0, 50, 100].map((level) => (
              <text key={level} x={PAD.left - 6} y={scaleY(level) + 3} textAnchor="end" className="fill-muted text-[9px]">
                {level}
              </text>
            ))}

            {/* charging bands */}
            {chargingBands.map((band) => (
              <rect
                key={band.key}
                x={band.x1}
                y={PAD.top}
                width={Math.max(0, band.x2 - band.x1)}
                height={INNER_HEIGHT}
                className="fill-good/15"
              />
            ))}

            {/* gap bridges — drawn first so the real data lines sit on top of them */}
            {gapConnectors.map((c) => (
              <line
                key={c.key}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                className="stroke-muted"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            ))}

            {/* level line(s) — split across gaps so offline stretches aren't interpolated */}
            {linePaths.map((d, i) => (
              <path key={i} d={d} fill="none" className="stroke-accent" strokeWidth={2} strokeLinecap="round" strokeLinejoin="miter" />
            ))}
            {runs
              .filter((run) => run.length === 1)
              .map((run) => (
                <circle key={run[0].id} cx={scaleX(run[0].recordedAt)} cy={scaleY(run[0].level)} r={2.5} className="fill-accent" />
              ))}

            {/* x-axis labels */}
            {ticks.map((tick) => (
              <text key={tick.x} x={tick.x} y={HEIGHT - 6} textAnchor="middle" className="fill-muted text-[9px]">
                {tick.label}
              </text>
            ))}

            {/* hover crosshair — a muted dot for an interpolated gap point
                instead of the accent used for a real reading, echoing the
                gap connector's own gray-vs-blue distinction */}
            {hover && hoverX !== null && hoverY !== null && (
              <>
                <line
                  x1={hoverX}
                  x2={hoverX}
                  y1={PAD.top}
                  y2={HEIGHT - PAD.bottom}
                  className="stroke-muted"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <circle cx={hoverX} cy={hoverY} r={3.5} className={hover.kind === "gap" ? "fill-muted" : "fill-accent"} />
              </>
            )}
          </svg>

          {hover && hoverX !== null && (
            <div
              className="absolute top-0 -translate-x-1/2 pointer-events-none bg-ink text-bg text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-sm"
              style={{ left: `${(hoverX / WIDTH) * 100}%` }}
            >
              {hover.kind === "reading" ? (
                <>
                  {formatTime(hover.reading.recordedAt)} · {hover.reading.level}%{hover.reading.isCharging ? " · Charging" : ""}
                </>
              ) : (
                <>{formatTime(new Date(hover.ms).toISOString())} · ~{Math.round(hover.level)}% (estimated)</>
              )}
            </div>
          )}
        </div>
      )}

      {readings.length > 0 && (
        <p className="text-xs text-muted mt-2 mb-0 flex items-center gap-4 flex-wrap">
          <span>
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-good/25 align-middle mr-1.5" />
            Shaded = on charger
          </span>
          {gapConnectors.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0">
                <line x1="0" y1="4" x2="16" y2="4" className="stroke-muted" strokeWidth={1.5} strokeDasharray="4 3" />
              </svg>
              Dashed = agent offline
            </span>
          )}
        </p>
      )}
    </Panel>
  );
}

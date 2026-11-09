import type { AppStat } from "../api/client";

export interface AppShareSlice {
  key: string;
  label: string;
  seconds: number;
  /** Both spelled out as literal class names (not derived with a runtime
   * `.replace()`) — Tailwind's build-time scanner only picks up class names
   * that appear as literal strings in source, so a string built at runtime
   * silently compiles to no CSS at all. */
  colorClass: string;
  strokeClass: string;
  /** null for the folded "Other" bucket — nothing to link an icon/dialog to. */
  appId: string | null;
  identifier: string | null;
  platform: "windows" | "android" | "extension" | null;
}

// The dataviz method's first 5 categorical slots (of its validated 8) — past
// that, a generated 6th hue would be indistinguishable from an existing one
// under CVD, so the tail folds into one neutral "Other" instead.
const CHART_COLORS = [
  { bg: "bg-chart-1", stroke: "stroke-chart-1" },
  { bg: "bg-chart-2", stroke: "stroke-chart-2" },
  { bg: "bg-chart-3", stroke: "stroke-chart-3" },
  { bg: "bg-chart-4", stroke: "stroke-chart-4" },
  { bg: "bg-chart-5", stroke: "stroke-chart-5" },
];

/**
 * Collapses a (possibly per-device) app list into per-app totals, sorted and
 * capped at a handful of categorical colors, for the "glance" chart views
 * (donut, share bar) — the exact-numbers view (the bar list, the day dialog)
 * stays ungrouped and uncapped.
 */
export function buildAppShares(apps: AppStat[]): AppShareSlice[] {
  const byApp = new Map<string, { label: string; seconds: number; identifier: string; platform: AppStat["platform"] }>();
  for (const app of apps) {
    const label = app.displayName ?? app.identifier;
    const existing = byApp.get(app.appId);
    if (existing) existing.seconds += app.totalSeconds;
    else byApp.set(app.appId, { label, seconds: app.totalSeconds, identifier: app.identifier, platform: app.platform });
  }

  const sorted = [...byApp.entries()].sort((a, b) => b[1].seconds - a[1].seconds);
  const top = sorted.slice(0, CHART_COLORS.length);
  const rest = sorted.slice(CHART_COLORS.length);

  const slices: AppShareSlice[] = top.map(([appId, { label, seconds, identifier, platform }], i) => ({
    key: appId,
    label,
    seconds,
    colorClass: CHART_COLORS[i].bg,
    strokeClass: CHART_COLORS[i].stroke,
    appId,
    identifier,
    platform,
  }));

  const otherSeconds = rest.reduce((sum, [, v]) => sum + v.seconds, 0);
  if (otherSeconds > 0) {
    slices.push({
      key: "__other__",
      label: "Other",
      seconds: otherSeconds,
      colorClass: "bg-border",
      strokeClass: "stroke-border",
      appId: null,
      identifier: null,
      platform: null,
    });
  }

  return slices;
}

import { useEffect, useMemo, useState } from "react";
import { Activity, AppWindow, ArrowLeftRight, Calendar, Flame, Globe, Plus, Target, TrendingUp, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  getDailyStats,
  getDevices,
  getGoals,
  getRangeStats,
  type DailyStats,
  type Device,
  type Goal,
  type RangeStats,
} from "../api/client";
import { addDays, formatDateOnly, formatWeekRange, isDifferentYear, mostRecentMonday, parseDateOnly, today, weekdayLabel } from "../utils/dates";
import { formatBytes, formatDuration } from "../utils/format";
import { usePageTitle } from "../utils/usePageTitle";
import { buildAppShares } from "../utils/chartColors";
import { useAsyncData } from "../hooks/useAsyncData";
import { ActiveIdleBalance } from "../components/ActiveIdleBalance";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DayActivityDialog } from "../components/DayActivityDialog";
import { AppBarRow } from "../components/AppBarRow";
import { AppDonutChart } from "../components/AppDonutChart";
import { AppShareBar } from "../components/AppShareBar";
import { AppIcon } from "../components/ui/AppIcon";
import { BatteryHistoryPanel } from "../components/BatteryHistoryPanel";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { DayNav } from "../components/ui/DayNav";
import { DeviceFilter } from "../components/ui/DeviceFilter";
import { SyncBar } from "../components/ui/SyncBar";
import { EmptyState } from "../components/ui/EmptyState";
import { StatCard } from "../components/ui/StatCard";

const TOP_APPS_LIMIT = 6;
const BROWSER_APPS_LIMIT = 6;
type TopAppsView = "bars" | "donut" | "share";

interface DashboardData {
  daily: DailyStats;
  /** The real current day's live total — independent of whichever day is
   * selected, needed only to patch the week chart's "today" bar (see below). */
  todaySeconds: number;
  range: RangeStats;
  devices: Device[];
  goals: Goal[];
}

function sumSeconds(stats: DailyStats): number {
  return stats.apps.reduce((sum, a) => sum + a.totalSeconds, 0);
}

function buildWeekDays(range: RangeStats | null, weekStart: Date): { date: string; totalSeconds: number }[] {
  const byDate = new Map((range?.daily ?? []).map((d) => [d.date, d.totalSeconds]));
  return Array.from({ length: 7 }, (_, i) => {
    const date = formatDateOnly(addDays(weekStart, i));
    return { date, totalSeconds: byDate.get(date) ?? 0 };
  });
}

export function DashboardPage() {
  usePageTitle("Dashboard");
  const { token } = useAuth();

  const todayStr = formatDateOnly(today());
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const isViewingToday = selectedDay === todayStr;

  // The calendar week (Mon-Sun) *containing* whichever day is selected — not a
  // rolling "last 7 days ending today" window. Browsing into a past day pulls
  // its whole week along with it, so "This week"/"Last week" mean what they say.
  const selectedWeekStart = mostRecentMonday(parseDateOnly(selectedDay));
  const selectedWeekStartStr = formatDateOnly(selectedWeekStart);
  const naturalWeekEndStr = formatDateOnly(addDays(selectedWeekStart, 6));
  // Never query past today — the current week's tail end just hasn't happened yet.
  const weekEndStr = naturalWeekEndStr > todayStr ? todayStr : naturalWeekEndStr;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [topAppsView, setTopAppsView] = useState<TopAppsView>("bars");
  const [browserAppsView, setBrowserAppsView] = useState<TopAppsView>("bars");
  // null = "All devices" (combined, the default). Goals aren't scoped by this —
  // a goal's progress is deliberately account-wide regardless of which device
  // the time happened on, so it stays out of this filter's reach.
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { data, loading, fetching, error, lastUpdated, reload } = useAsyncData<DashboardData>(
    async () => {
      const deviceId = selectedDeviceId ?? undefined;
      const [daily, liveToday, range, devicesRes, goalsRes] = await Promise.all([
        getDailyStats(token!, selectedDay, deviceId),
        // Only fetch today separately when browsing a *different* day — when
        // selectedDay already is today, `daily` above already is that fetch.
        isViewingToday ? Promise.resolve(null) : getDailyStats(token!, todayStr, deviceId),
        getRangeStats(token!, selectedWeekStartStr, weekEndStr, deviceId),
        getDevices(token!),
        getGoals(token!),
      ]);
      return {
        daily,
        todaySeconds: sumSeconds(liveToday ?? daily),
        range,
        devices: devicesRes.devices,
        goals: goalsRes.goals,
      };
    },
    [token, selectedDay, selectedDeviceId],
    {
      enabled: !!token,
      showLoadingOnReload: false,
      fallbackErrorMessage: "Couldn't load dashboard data.",
      cacheKey: `dashboard:${selectedDay}:${selectedDeviceId ?? "all"}`,
    }
  );
  const daily = data?.daily ?? null;
  const todaySeconds = data?.todaySeconds ?? 0;
  const range = data?.range ?? null;
  const devices = data?.devices ?? [];
  const goals = data?.goals ?? [];

  // Self-heals the selection if the picked device stops being a valid choice
  // (revoked from the /devices page, e.g.) — falls back to "All devices"
  // rather than silently keep filtering to a device that's no longer listed.
  useEffect(() => {
    if (selectedDeviceId && !devices.some((d) => d.id === selectedDeviceId && !d.revokedAt)) {
      setSelectedDeviceId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  const allApps = useMemo(
    () => [...(daily?.apps ?? [])].sort((a, b) => b.totalSeconds - a.totalSeconds),
    [daily]
  );
  // Browser (extension) activity gets its own panel below, not mixed into "Top
  // apps" — a site visited for 30s would otherwise sit in the same ranked list as
  // hours-long desktop app usage, and the two answer different questions anyway
  // ("what app was open" vs. "what site were you on").
  const desktopApps = useMemo(() => allApps.filter((a) => a.platform !== "extension"), [allApps]);
  const browserApps = useMemo(() => allApps.filter((a) => a.platform === "extension"), [allApps]);
  const desktopTotal = desktopApps.reduce((sum, a) => sum + a.totalSeconds, 0);
  const browserTotal = browserApps.reduce((sum, a) => sum + a.totalSeconds, 0);
  const topApps = desktopApps.slice(0, TOP_APPS_LIMIT);
  const maxAppSeconds = Math.max(1, ...desktopApps.map((a) => a.totalSeconds));
  const appShares = useMemo(() => buildAppShares(desktopApps), [desktopApps]);
  const topBrowserApps = browserApps.slice(0, BROWSER_APPS_LIMIT);
  const maxBrowserSeconds = Math.max(1, ...browserApps.map((a) => a.totalSeconds));
  const browserShares = useMemo(() => buildAppShares(browserApps), [browserApps]);
  // Only worth labeling which device an app ran on once there's more than one to tell
  // apart *and* the view isn't already scoped to one — every row would repeat the
  // same name once a specific device is selected.
  const showDeviceLabels = devices.length > 1 && !selectedDeviceId;

  const isYesterday = selectedDay === formatDateOnly(addDays(today(), -1));
  const dayLabel = isViewingToday
    ? "today"
    : isYesterday
      ? "yesterday"
      : parseDateOnly(selectedDay).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          ...(isDifferentYear(parseDateOnly(selectedDay)) ? { year: "numeric" } : {}),
        });
  const dayTotal = daily?.apps.reduce((sum, a) => sum + a.totalSeconds, 0) ?? 0;
  // The rollup that fills `range.daily` runs every 5 minutes, so today's entry in it
  // can lag — substitute the live total for today everywhere weekDays is used (the
  // chart's bar height *and* its click-to-open gating both depend on this; leaving
  // today's stale/possibly-zero rollup value in here made today's bar silently
  // undisabled-but-empty or outright unclickable while there was clearly live activity).
  // Uses `todaySeconds`, not `dayTotal` — those only coincide while browsing today.
  const weekDays = buildWeekDays(range, selectedWeekStart).map((d) => (d.date === todayStr ? { ...d, totalSeconds: todaySeconds } : d));
  const maxWeekSeconds = Math.max(1, ...weekDays.map((d) => d.totalSeconds));

  const currentWeekStart = mostRecentMonday(today());
  const weeksAgo = Math.round((currentWeekStart.getTime() - selectedWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const weekLabel =
    weeksAgo === 0 ? "This week" : weeksAgo === 1 ? "Last week" : formatWeekRange(selectedWeekStartStr, naturalWeekEndStr);

  const weekTotal = weekDays.reduce((sum, d) => sum + d.totalSeconds, 0);
  // Days *elapsed* in the week, not always 7 — the current week's daily average
  // would otherwise be diluted by days that haven't happened yet.
  const daysElapsedInWeek = Math.min(7, Math.floor((today().getTime() - selectedWeekStart.getTime()) / 86_400_000) + 1);
  const dailyAverage = Math.round(weekTotal / Math.max(1, daysElapsedInWeek));
  const topApp = desktopApps[0] ?? null;

  const idleSeconds = daily?.idleSeconds ?? 0;
  const dayWifiBytes = daily?.totalWifiBytes ?? 0;
  const dayCellularBytes = daily?.totalCellularBytes ?? 0;
  const dayHotspotBytes = daily?.totalHotspotBytes ?? 0;
  const dayTotalBytes = daily?.totalBytes ?? (dayWifiBytes + dayCellularBytes + dayHotspotBytes);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold m-0">Dashboard</h1>
        <div className="flex items-center gap-3">
          <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
          <DeviceFilter devices={devices} value={selectedDeviceId} onChange={setSelectedDeviceId} />
          <DayNav value={selectedDay} onChange={setSelectedDay} />
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <div className={`grid ${dayTotalBytes > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} gap-3`}>
        <StatCard
          icon={Calendar}
          label={weekLabel}
          value={formatDuration(weekTotal)}
          hint={`${formatDuration(dailyAverage)}/day avg`}
        />
        <StatCard
          icon={ArrowLeftRight}
          label="Switches"
          value={daily ? String(daily.switchCount) : "—"}
          hint={dayLabel}
        />
        <StatCard
          icon={Flame}
          label="Top app"
          value={topApp ? topApp.displayName ?? topApp.identifier : "—"}
          hint={topApp ? `${formatDuration(topApp.totalSeconds)}${topApp.totalBytes ? ` · ${formatBytes(topApp.totalBytes)}` : ""}` : undefined}
          valueIcon={topApp && <AppIcon appId={topApp.appId} identifier={topApp.identifier} platform={topApp.platform} size={18} />}
        />
        {dayTotalBytes > 0 && (
          <Link to="/traffic" className="no-underline block h-full">
            <StatCard
              icon={Wifi}
              label="Internet data"
              value={formatBytes(dayTotalBytes)}
              hint={
                dayHotspotBytes > 0
                  ? `Hotspot: ${formatBytes(dayHotspotBytes)}`
                  : dayCellularBytes > 0
                    ? `Mobile: ${formatBytes(dayCellularBytes)}`
                    : `Wi-Fi: ${formatBytes(dayWifiBytes)}`
              }
            />
          </Link>
        )}
      </div>

      {daily && (dayTotal > 0 || daily.idleSeconds > 0) && (
        <Panel>
          <PanelHeading icon={Activity}>Balance</PanelHeading>
          <ActiveIdleBalance activeSeconds={dayTotal} idleSeconds={idleSeconds} chargingSeconds={daily.activeChargingSeconds} />
        </Panel>
      )}

      {/* Scoped to one device via the filter above, "Top apps" (desktop/mobile-only —
          see the platform split below) has nothing it could ever show for a browser
          device: hide rather than display a permanently-empty panel pointing at a
          "Browser activity" that isn't even on screen in that scope. Viewing "All
          devices" keeps showing it even when empty, since then the empty state is
          actually informative ("no desktop activity — see Browser activity below"). */}
      {(topApps.length > 0 || !selectedDeviceId) && (
        <Panel>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <PanelHeading icon={AppWindow} className="mb-0">
              Top apps
            </PanelHeading>
            <SegmentedControl
              options={[
                { value: "bars" as const, label: "Bars" },
                { value: "donut" as const, label: "Donut" },
                { value: "share" as const, label: "Share" },
              ]}
              value={topAppsView}
              onChange={setTopAppsView}
            />
          </div>

          {/* Keyed by the view so switching Bars/Donut/Share remounts this wrapper and
              replays its entrance animation — a deliberate "new view settling in" beat
              instead of an instant swap. */}
          <div key={topApps.length === 0 ? "empty" : topAppsView} className="animate-pop">
            {topApps.length === 0 ? (
              <EmptyState>
                {browserApps.length > 0
                  ? "No desktop activity — see Browser activity below."
                  : isViewingToday
                    ? "No activity tracked yet today."
                    : "No activity recorded this day."}
              </EmptyState>
            ) : topAppsView === "bars" ? (
              topApps.map((app) => (
                <AppBarRow key={`${app.appId}:${app.deviceId}`} app={app} maxSeconds={maxAppSeconds} showDevice={showDeviceLabels} />
              ))
            ) : topAppsView === "donut" ? (
              <AppDonutChart slices={appShares} total={desktopTotal} />
            ) : (
              <AppShareBar slices={appShares} total={desktopTotal} />
            )}
          </div>

          {allApps.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border text-center">
              <button
                type="button"
                className="bg-transparent border-none text-accent font-medium text-xs cursor-pointer hover:underline"
                onClick={() => setSelectedDate(selectedDay)}
              >
                View all {allApps.length} apps
              </button>
            </div>
          )}
        </Panel>
      )}

      {browserApps.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <PanelHeading icon={Globe} className="mb-0">
              Browser activity
            </PanelHeading>
            <SegmentedControl
              options={[
                { value: "bars" as const, label: "Bars" },
                { value: "donut" as const, label: "Donut" },
                { value: "share" as const, label: "Share" },
              ]}
              value={browserAppsView}
              onChange={setBrowserAppsView}
            />
          </div>

          <div key={browserAppsView} className="animate-pop">
            {browserAppsView === "bars" ? (
              topBrowserApps.map((app) => (
                <AppBarRow
                  key={`${app.appId}:${app.deviceId}`}
                  app={app}
                  maxSeconds={maxBrowserSeconds}
                  showDevice={showDeviceLabels}
                  showSessions
                />
              ))
            ) : browserAppsView === "donut" ? (
              <AppDonutChart slices={browserShares} total={browserTotal} />
            ) : (
              <AppShareBar slices={browserShares} total={browserTotal} />
            )}
          </div>

          {browserAppsView === "bars" && browserApps.length > topBrowserApps.length && (
            <div className="mt-4 pt-3 border-t border-border text-center">
              <button
                type="button"
                className="bg-transparent border-none text-accent font-medium text-xs cursor-pointer hover:underline"
                onClick={() => setSelectedDate(selectedDay)}
              >
                +{browserApps.length - topBrowserApps.length} more site{browserApps.length - topBrowserApps.length === 1 ? "" : "s"} — view all apps
              </button>
            </div>
          )}
        </Panel>
      )}

      {goals.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <PanelHeading icon={Target} className="mb-0">
              Today's goals
            </PanelHeading>
            <Link to="/apps" className="text-accent text-xs font-medium no-underline hover:underline flex items-center gap-1">
              <Plus size={12} /> Manage
            </Link>
          </div>
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.actualSeconds / goal.limitSeconds) * 100));
            const over = goal.actualSeconds >= goal.limitSeconds;
            return (
              <div key={goal.id} className="py-2.5 border-b border-border last:border-b-0">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-sm font-medium flex items-center gap-1.5 min-w-0 truncate">
                    {goal.appId && <AppIcon appId={goal.appId} identifier={goal.appIdentifier} platform={goal.appPlatform} size={14} />}
                    {goal.appDisplayName ?? goal.appIdentifier ?? "Whole device"}
                  </span>
                  <span className={`text-xs tabular-nums shrink-0 ${over ? "text-danger" : "text-muted"}`}>
                    {formatDuration(goal.actualSeconds)} / {formatDuration(goal.limitSeconds)}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ease-out ${over ? "bg-danger" : "bg-accent"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Panel>
      )}

      <BatteryHistoryPanel token={token} devices={devices} date={selectedDay} />

      <Panel>
        <PanelHeading icon={TrendingUp}>{weekLabel}</PanelHeading>
        <div className="flex items-end gap-2.5 h-[140px] pt-7">
          {weekDays.map((day) => {
            const isSelected = day.date === selectedDay;
            const isRealToday = day.date === todayStr;
            const clickable = day.totalSeconds > 0;
            return (
              <button
                type="button"
                key={day.date}
                className="group flex-1 flex flex-col items-center h-full justify-end gap-2 relative bg-transparent border-none p-0 disabled:cursor-default"
                onClick={() => setSelectedDay(day.date)}
                disabled={!clickable}
              >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-1.5 bg-ink text-bg text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  {formatDuration(day.totalSeconds)}
                </span>
                <div
                  className={`w-full max-w-8 rounded-t rounded-b-sm min-h-[3px] transition-opacity group-hover:opacity-75 ${
                    isSelected ? "bg-accent" : "bg-accent/60"
                  }`}
                  style={{ height: `${Math.max(4, (day.totalSeconds / maxWeekSeconds) * 100)}%` }}
                />
                <span className={`text-[0.72rem] flex items-center gap-1 ${isSelected ? "text-accent font-semibold" : "text-muted"}`}>
                  {weekdayLabel(day.date)}
                  {isRealToday && !isSelected && <span className="w-1 h-1 rounded-full bg-accent shrink-0" />}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>

      <DayActivityDialog date={selectedDate} token={token} deviceId={selectedDeviceId} onClose={() => setSelectedDate(null)} />
    </div>
  );
}

import { useMemo, useState } from "react";
import { Activity, AppWindow, ArrowLeftRight, Calendar, Flame, Globe, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  getDailyStats,
  getDevices,
  getGoals,
  getRangeStats,
  type DailyStats,
  type Device,
  type Goal,
  type RangeStats,
} from "../../api/client";
import { addDays, formatDateOnly, formatWeekRange, mostRecentMonday, parseDateOnly, today, weekdayLabel } from "../../utils/dates";
import { formatBytes, formatDuration } from "../../utils/format";
import { usePageTitle } from "../../utils/usePageTitle";
import { buildAppShares } from "../../utils/chartColors";
import { useAsyncData } from "../../hooks/useAsyncData";
import { ActiveIdleBalance } from "../../components/ActiveIdleBalance";
import { DashboardSkeleton } from "../../components/DashboardSkeleton";
import { DayActivityDialog } from "../../components/DayActivityDialog";
import { AppBarRow } from "../../components/AppBarRow";
import { AppDonutChart } from "../../components/AppDonutChart";
import { AppShareBar } from "../../components/AppShareBar";
import { AppIcon } from "../../components/ui/AppIcon";
import { BatteryHistoryPanel } from "../../components/BatteryHistoryPanel";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { DayNav } from "../../components/ui/DayNav";
import { DeviceFilter } from "../../components/ui/DeviceFilter";
import { SyncBar } from "../../components/ui/SyncBar";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";

const TOP_APPS_LIMIT = 6;
const BROWSER_APPS_LIMIT = 6;
type TopAppsView = "bars" | "donut" | "share";

interface DashboardData {
  daily: DailyStats | null;
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

  const selectedWeekStart = mostRecentMonday(parseDateOnly(selectedDay));
  const selectedWeekStartStr = formatDateOnly(selectedWeekStart);
  const naturalWeekEndStr = formatDateOnly(addDays(selectedWeekStart, 6));
  const weekEndStr = naturalWeekEndStr > todayStr ? todayStr : naturalWeekEndStr;

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [topAppsView, setTopAppsView] = useState<TopAppsView>("bars");
  const [browserAppsView, setBrowserAppsView] = useState<TopAppsView>("bars");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, loading, fetching, error, lastUpdated, reload } = useAsyncData<DashboardData>(
    async () => {
      const deviceId = selectedDeviceId ?? undefined;
      const [daily, liveToday, range, devicesRes, goalsRes] = await Promise.all([
        getDailyStats(token!, selectedDay, deviceId),
        selectedDay === todayStr ? Promise.resolve(null) : getDailyStats(token!, todayStr, deviceId),
        getRangeStats(token!, selectedWeekStartStr, weekEndStr, deviceId),
        getDevices(token!),
        getGoals(token!),
      ]);

      const todaySeconds = liveToday ? sumSeconds(liveToday) : daily ? sumSeconds(daily) : 0;
      return { daily, todaySeconds, range, devices: devicesRes.devices, goals: goalsRes.goals };
    },
    [token, selectedDay, selectedDeviceId],
    { enabled: !!token, showLoadingOnReload: false, fallbackErrorMessage: "Couldn't load dashboard.", cacheKey: "dashboard" }
  );

  const daily = data?.daily ?? null;
  const todaySeconds = data?.todaySeconds ?? 0;
  const range = data?.range ?? null;
  const devices = data?.devices ?? [];

  const isViewingToday = selectedDay === todayStr;
  const showDeviceLabels = !selectedDeviceId;

  const allApps = useMemo(
    () => [...(daily?.apps ?? [])].sort((a, b) => b.totalSeconds - a.totalSeconds),
    [daily?.apps]
  );
  const desktopApps = useMemo(
    () => allApps.filter((a) => a.platform !== "extension"),
    [allApps]
  );
  const browserApps = useMemo(
    () => allApps.filter((a) => a.platform === "extension"),
    [allApps]
  );

  const desktopTotal = desktopApps.reduce((sum, a) => sum + a.totalSeconds, 0);
  const browserTotal = browserApps.reduce((sum, a) => sum + a.totalSeconds, 0);

  const maxAppSeconds = Math.max(1, ...desktopApps.map((a) => a.totalSeconds));
  const topApps = desktopApps.slice(0, TOP_APPS_LIMIT);

  const maxBrowserSeconds = Math.max(1, ...browserApps.map((a) => a.totalSeconds));
  const topBrowserApps = browserApps.slice(0, BROWSER_APPS_LIMIT);

  const appShares = useMemo(
    () => buildAppShares(desktopApps),
    [desktopApps]
  );
  const browserShares = useMemo(
    () => buildAppShares(browserApps),
    [browserApps]
  );

  const topApp = allApps[0] ?? null;

  const idleSeconds = daily?.idleSeconds ?? 0;
  const dayTotal = daily?.apps.reduce((sum, a) => sum + a.totalSeconds, 0) ?? 0;

  const daysWithData = (range?.daily ?? []).filter((d) => d.totalSeconds > 0).length;
  const weekSum = (range?.daily ?? []).reduce((sum, d) => sum + d.totalSeconds, 0);
  const dailyAverage = daysWithData > 0 ? Math.round(weekSum / daysWithData) : 0;

  const weekDays = buildWeekDays(range, selectedWeekStart).map((d) => (d.date === todayStr ? { ...d, totalSeconds: todaySeconds } : d));
  const maxWeekSeconds = Math.max(1, ...weekDays.map((d) => d.totalSeconds));

  const weekLabel = formatWeekRange(selectedWeekStartStr, naturalWeekEndStr);
  const dayLabel = weekdayLabel(selectedDay);

  const weekTotal = weekDays.reduce((sum, d) => sum + d.totalSeconds, 0);

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
          hint={`${formatDuration(dailyAverage)}/kun o'rtacha`}
        />
        <StatCard
          icon={ArrowLeftRight}
          label="O'tishlar"
          value={daily ? String(daily.switchCount) : "—"}
          hint={dayLabel}
        />
        <StatCard
          icon={Flame}
          label="Top ilova"
          value={topApp ? topApp.displayName ?? topApp.identifier : "—"}
          hint={topApp ? `${formatDuration(topApp.totalSeconds)}${topApp.totalBytes ? ` · ${formatBytes(topApp.totalBytes)}` : ""}` : undefined}
          valueIcon={topApp && <AppIcon appId={topApp.appId} identifier={topApp.identifier} platform={topApp.platform} size={18} />}
        />
        {dayTotalBytes > 0 && (
          <Link to="/data-usage" className="no-underline block h-full">
            <StatCard
              icon={Wifi}
              label="Internet sarfi"
              value={formatBytes(dayTotalBytes)}
              hint={
                dayHotspotBytes > 0
                  ? `Hotspot: ${formatBytes(dayHotspotBytes)}`
                  : dayCellularBytes > 0
                    ? `Mobil: ${formatBytes(dayCellularBytes)}`
                    : `Wi-Fi: ${formatBytes(dayWifiBytes)}`
              }
            />
          </Link>
        )}
      </div>

      {daily && (dayTotal > 0 || daily.idleSeconds > 0) && (
        <Panel>
          <PanelHeading icon={Activity}>Balans</PanelHeading>
          <ActiveIdleBalance activeSeconds={dayTotal} idleSeconds={idleSeconds} chargingSeconds={daily.activeChargingSeconds} />
        </Panel>
      )}

      {(topApps.length > 0 || !selectedDeviceId) && (
        <Panel>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <PanelHeading icon={AppWindow} className="mb-0">
              Faol ilovalar
            </PanelHeading>
            <SegmentedControl
              options={[
                { value: "bars" as const, label: "Ustunlar" },
                { value: "donut" as const, label: "Doira" },
                { value: "share" as const, label: "Ulush" },
              ]}
              value={topAppsView}
              onChange={setTopAppsView}
            />
          </div>

          <div key={topApps.length === 0 ? "empty" : topAppsView} className="animate-pop">
            {topApps.length === 0 ? (
              <EmptyState>
                {browserApps.length > 0
                  ? "Ilovalar faolligi yo'q — quyidagi veb faollikni ko'ring."
                  : isViewingToday
                    ? "Bugun hali faollik yozilmadi."
                    : "Ushbu kunda faollik qayd etilmagan."}
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
              <Link
                to="/app-usage"
                className="bg-transparent border-none text-accent font-medium text-xs cursor-pointer hover:underline"
              >
                Barcha {allApps.length} ta ilovani ko'rish →
              </Link>
            </div>
          )}
        </Panel>
      )}

      {browserApps.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <PanelHeading icon={Globe} className="mb-0">
              Veb faolligi
            </PanelHeading>
            <SegmentedControl
              options={[
                { value: "bars" as const, label: "Ustunlar" },
                { value: "donut" as const, label: "Doira" },
                { value: "share" as const, label: "Ulush" },
              ]}
              value={browserAppsView}
              onChange={setBrowserAppsView}
            />
          </div>

          <div key={browserAppsView} className="animate-pop">
            {browserAppsView === "bars" ? (
              topBrowserApps.map((app) => (
                <AppBarRow key={`${app.appId}:${app.deviceId}`} app={app} maxSeconds={maxBrowserSeconds} showDevice={false} />
              ))
            ) : browserAppsView === "donut" ? (
              <AppDonutChart slices={browserShares} total={browserTotal} />
            ) : (
              <AppShareBar slices={browserShares} total={browserTotal} />
            )}
          </div>
        </Panel>
      )}

      {/* Battery panel for mobile/battery devices */}
      <BatteryHistoryPanel token={token} devices={devices} date={selectedDay} />

      {/* Week bar chart */}
      <Panel>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <PanelHeading icon={Calendar} className="mb-0">
            Haftalik ko'rinish
          </PanelHeading>
          <span className="text-xs text-muted font-medium">Jami: {formatDuration(weekTotal)}</span>
        </div>

        <div className="grid grid-cols-7 gap-2 h-36 items-end pt-4 pb-2 border-b border-border">
          {weekDays.map((day) => {
            const isTodayDay = day.date === todayStr;
            const isSelected = day.date === selectedDay;
            const heightPercent = Math.max(8, Math.round((day.totalSeconds / maxWeekSeconds) * 100));

            return (
              <div
                key={day.date}
                onClick={() => setSelectedDay(day.date)}
                className={`flex flex-col items-center gap-1.5 cursor-pointer group h-full justify-end p-1 rounded-lg transition-colors ${
                  isSelected ? "bg-accent/10" : "hover:bg-bg"
                }`}
              >
                <div className="text-[11px] font-mono text-muted group-hover:text-ink">
                  {formatDuration(day.totalSeconds)}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-md transition-all ${
                    isSelected
                      ? "bg-accent"
                      : isTodayDay
                        ? "bg-accent/70"
                        : day.totalSeconds > 0
                          ? "bg-muted/40 group-hover:bg-muted/60"
                          : "bg-border"
                  }`}
                />
                <span className={`text-xs ${isSelected ? "font-bold text-accent" : "text-muted"}`}>
                  {weekdayLabel(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Day activity dialog */}
      {selectedDate && <DayActivityDialog token={token!} date={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
}

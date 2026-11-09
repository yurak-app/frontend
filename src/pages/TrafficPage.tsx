import { useMemo, useState } from "react";
import {
  Activity,
  HardDrive,
  Radio,
  Search,
  Signal,
  Wifi,
} from "lucide-react";
import { getDailyStats, getDevices, getRangeStats, type DailyStats, type Device, type RangeStats } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePageTitle } from "../utils/usePageTitle";
import { addDays, formatDateOnly, mostRecentMonday, parseDateOnly, today, weekdayLabel } from "../utils/dates";
import { formatBytes, formatDuration } from "../utils/format";
import { AppIcon } from "../components/ui/AppIcon";
import { DayNav } from "../components/ui/DayNav";
import { DeviceFilter } from "../components/ui/DeviceFilter";
import { EmptyState } from "../components/ui/EmptyState";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { StatCard } from "../components/ui/StatCard";
import { SyncBar } from "../components/ui/SyncBar";

interface TrafficPageData {
  daily: DailyStats | null;
  range: RangeStats | null;
  devices: Device[];
}

export function TrafficPage() {
  usePageTitle("Data & Traffic");
  const { token } = useAuth();

  const todayStr = formatDateOnly(today());
  const [selectedDay, setSelectedDay] = useState(todayStr);

  const selectedWeekStart = mostRecentMonday(parseDateOnly(selectedDay));
  const selectedWeekStartStr = formatDateOnly(selectedWeekStart);
  const naturalWeekEndStr = formatDateOnly(addDays(selectedWeekStart, 6));
  const weekEndStr = naturalWeekEndStr > todayStr ? todayStr : naturalWeekEndStr;

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "android" | "windows" | "extension">("all");
  const [sortBy, setSortBy] = useState<"bytes" | "duration" | "name">("bytes");

  const { data, fetching, error, lastUpdated, reload } = useAsyncData<TrafficPageData>(
    async () => {
      const deviceId = selectedDeviceId ?? undefined;
      const [daily, range, devicesRes] = await Promise.all([
        getDailyStats(token!, selectedDay, deviceId),
        getRangeStats(token!, selectedWeekStartStr, weekEndStr, deviceId),
        getDevices(token!),
      ]);
      return { daily, range, devices: devicesRes.devices };
    },
    [token, selectedDay, selectedDeviceId]
  );

  const daily = data?.daily;
  const range = data?.range;
  const devices = data?.devices ?? [];

  const totalBytes = daily?.totalBytes ?? 0;
  const hotspotBytes = daily?.totalHotspotBytes ?? 0;
  const cellularBytes = daily?.totalCellularBytes ?? 0;
  const wifiBytes = daily?.totalWifiBytes ?? 0;

  // Process and filter applications
  const processedApps = useMemo(() => {
    if (!daily?.apps) return [];

    return daily.apps
      .filter((app) => {
        const matchesPlatform =
          platformFilter === "all" ||
          (platformFilter === "android" && app.platform === "android") ||
          (platformFilter === "windows" && app.platform === "windows") ||
          (platformFilter === "extension" && app.platform === "extension");

        const name = (app.displayName ?? app.identifier).toLowerCase();
        const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());

        return matchesPlatform && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "bytes") return (b.totalBytes ?? 0) - (a.totalBytes ?? 0);
        if (sortBy === "duration") return b.totalSeconds - a.totalSeconds;
        return (a.displayName ?? a.identifier).localeCompare(b.displayName ?? b.identifier);
      });
  }, [daily?.apps, platformFilter, searchQuery, sortBy]);

  const maxAppBytes = useMemo(() => {
    return Math.max(1, ...(daily?.apps.map((a) => a.totalBytes ?? 0) ?? [1]));
  }, [daily?.apps]);

  // Weekly data points for chart
  const weekPoints = useMemo(() => {
    const dailyMap = new Map((range?.daily ?? []).map((d) => [d.date, d]));
    return Array.from({ length: 7 }, (_, i) => {
      const date = formatDateOnly(addDays(selectedWeekStart, i));
      const entry = dailyMap.get(date);
      return {
        date,
        dayLabel: weekdayLabel(date),
        totalBytes: entry?.totalBytes ?? 0,
        hotspotBytes: entry?.hotspotBytes ?? 0,
        cellularBytes: entry?.cellularBytes ?? 0,
        wifiBytes: entry?.wifiBytes ?? 0,
      };
    });
  }, [range?.daily, selectedWeekStart]);

  const maxWeekBytes = useMemo(() => {
    return Math.max(1024 * 1024, ...weekPoints.map((p) => p.totalBytes));
  }, [weekPoints]);

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2 m-0">
            <Radio className="text-accent" size={24} />
            Data & Network Traffic
          </h1>
          <p className="text-muted text-sm mt-1 mb-0">
            Detailed bandwidth consumption across your devices, apps, and domains
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
          <DeviceFilter devices={devices} value={selectedDeviceId} onChange={setSelectedDeviceId} />
          <DayNav value={selectedDay} onChange={setSelectedDay} />
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      {/* 4 Hero Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Activity}
          label="Total Traffic"
          value={formatBytes(totalBytes)}
          hint={totalBytes > 0 ? "All network interfaces" : "No usage"}
        />
        <StatCard
          icon={Radio}
          label="Hotspot / Tether"
          value={formatBytes(hotspotBytes)}
          hint={hotspotBytes > 0 ? "Shared with other devices" : "0 B"}
        />
        <StatCard
          icon={Signal}
          label="Mobile Data"
          value={formatBytes(cellularBytes)}
          hint={cellularBytes > 0 ? "SIM-card cellular data" : "0 B"}
        />
        <StatCard
          icon={Wifi}
          label="Wi-Fi Network"
          value={formatBytes(wifiBytes)}
          hint={wifiBytes > 0 ? "Wireless LAN network" : "0 B"}
        />
      </div>

      {/* Weekly Traffic Trend Bar Chart */}
      <Panel>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <PanelHeading icon={Radio} className="mb-0">
            Weekly Traffic Trend
          </PanelHeading>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Hotspot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Cellular
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Wi-Fi
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-4 pb-2">
          <div className="flex items-end justify-between h-40 gap-2 px-2">
            {weekPoints.map((p) => {
              const heightPct = Math.min(100, Math.max(4, Math.round((p.totalBytes / maxWeekBytes) * 100)));
              const isSelected = p.date === selectedDay;

              const hotspotPct = p.totalBytes > 0 ? (p.hotspotBytes / p.totalBytes) * 100 : 0;
              const cellularPct = p.totalBytes > 0 ? (p.cellularBytes / p.totalBytes) * 100 : 0;
              const wifiPct = p.totalBytes > 0 ? (p.wifiBytes / p.totalBytes) * 100 : 0;

              return (
                <div
                  key={p.date}
                  onClick={() => setSelectedDay(p.date)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatBytes(p.totalBytes)}
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[42px] rounded-t-md overflow-hidden flex flex-col justify-end transition-all ${
                      isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-surface shadow-md" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {p.totalBytes === 0 ? (
                      <div className="w-full h-full bg-border/40" />
                    ) : (
                      <>
                        {wifiPct > 0 && <div style={{ height: `${wifiPct}%` }} className="w-full bg-sky-500" />}
                        {cellularPct > 0 && <div style={{ height: `${cellularPct}%` }} className="w-full bg-purple-500" />}
                        {hotspotPct > 0 && <div style={{ height: `${hotspotPct}%` }} className="w-full bg-amber-500" />}
                      </>
                    )}
                  </div>

                  <span
                    className={`text-xs mt-2 font-medium ${
                      isSelected ? "text-accent font-bold" : "text-muted"
                    }`}
                  >
                    {p.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Apps & Domains Traffic Breakdown */}
      <Panel>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <PanelHeading icon={HardDrive} className="mb-0">
            Application & Domain Breakdown
          </PanelHeading>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Filter apps or domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-bg border border-border rounded-lg text-ink focus:outline-none focus:border-accent w-48"
              />
            </div>

            {/* Platform pills */}
            <div className="flex items-center bg-bg p-0.5 rounded-lg border border-border text-xs">
              {(["all", "android", "windows", "extension"] as const).map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    platformFilter === plat ? "bg-surface text-ink shadow-xs" : "text-muted hover:text-ink"
                  }`}
                >
                  {plat === "all" ? "All" : plat}
                </button>
              ))}
            </div>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "bytes" | "duration" | "name")}
              className="bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-accent"
            >
              <option value="bytes">Sort: Data Traffic</option>
              <option value="duration">Sort: Active Time</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        {processedApps.length === 0 ? (
          <EmptyState>No activity or traffic recorded for this filter.</EmptyState>
        ) : (
          <div className="divide-y divide-border">
            {processedApps.map((app, index) => {
              const appTotalBytes = app.totalBytes ?? 0;
              const barPct = Math.min(100, Math.max(2, Math.round((appTotalBytes / maxAppBytes) * 100)));

              const hasHotspot = (app.hotspotBytes ?? 0) > 0;
              const hasCellular = (app.cellularBytes ?? 0) > 0;
              const hasWifi = (app.wifiBytes ?? 0) > 0;

              return (
                <div key={`${app.appId}:${app.deviceId}`} className="py-3 group hover:bg-bg/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-mono text-muted w-5 shrink-0">{index + 1}</span>
                      <AppIcon appId={app.appId} identifier={app.identifier} platform={app.platform} size={22} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink truncate flex items-center gap-2">
                          {app.displayName ?? app.identifier}
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted px-1.5 py-0.5 rounded-sm bg-bg border border-border">
                            {app.platform}
                          </span>
                        </div>
                        <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                          <span>{formatDuration(app.totalSeconds)} active</span>
                          {app.deviceName && <span>· {app.deviceName}</span>}
                          {hasHotspot && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              · Hotspot: {formatBytes(app.hotspotBytes)}
                            </span>
                          )}
                          {hasCellular && (
                            <span className="text-purple-600 dark:text-purple-400 font-medium">
                              · Mobile: {formatBytes(app.cellularBytes)}
                            </span>
                          )}
                          {hasWifi && (
                            <span className="text-sky-600 dark:text-sky-400 font-medium">
                              · Wi-Fi: {formatBytes(app.wifiBytes)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-ink tabular-nums">
                        {formatBytes(appTotalBytes)}
                      </span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden mt-2.5">
                    <div
                      style={{ width: `${barPct}%` }}
                      className={`h-full rounded-full transition-all ${
                        hasHotspot ? "bg-amber-500" : hasCellular ? "bg-purple-500" : "bg-accent"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

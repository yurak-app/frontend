import { useMemo, useState } from "react";
import {
  HardDrive,
  Radio,
  Signal,
  Wifi,
} from "lucide-react";
import { getDailyStats, getDevices, type DailyStats, type Device } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageTitle } from "../../utils/usePageTitle";
import { formatDateOnly, today, weekdayLabel } from "../../utils/dates";
import { formatBytes, formatDuration } from "../../utils/format";
import { AppIcon } from "../../components/ui/AppIcon";
import { DayNav } from "../../components/ui/DayNav";
import { DeviceFilter } from "../../components/ui/DeviceFilter";
import { EmptyState } from "../../components/ui/EmptyState";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { StatCard } from "../../components/ui/StatCard";
import { SyncBar } from "../../components/ui/SyncBar";

interface TrafficPageData {
  daily: DailyStats | null;
  devices: Device[];
}

export function DataUsagePage() {
  usePageTitle("Tarmoq Trafigi Hisoboti");
  const { token } = useAuth();

  const todayStr = formatDateOnly(today());
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"bytes" | "duration" | "name">("bytes");

  const { data, fetching, error, lastUpdated, reload } = useAsyncData<TrafficPageData>(
    async () => {
      const deviceId = selectedDeviceId ?? undefined;
      const [daily, devicesRes] = await Promise.all([
        getDailyStats(token!, selectedDay, deviceId),
        getDevices(token!),
      ]);
      return { daily, devices: devicesRes.devices };
    },
    [token, selectedDay, selectedDeviceId]
  );

  const daily = data?.daily ?? null;
  const devices = data?.devices ?? [];

  const wifiBytes = daily?.totalWifiBytes ?? 0;
  const cellularBytes = daily?.totalCellularBytes ?? 0;
  const hotspotBytes = daily?.totalHotspotBytes ?? 0;
  const totalBytes = daily?.totalBytes ?? (wifiBytes + cellularBytes + hotspotBytes);

  const allApps = useMemo(() => daily?.apps ?? [], [daily?.apps]);

  const filteredApps = useMemo(() => {
    return allApps
      .filter((app) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const name = (app.displayName || app.identifier).toLowerCase();
          if (!name.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "bytes") return (b.totalBytes ?? 0) - (a.totalBytes ?? 0);
        if (sortBy === "duration") return b.totalSeconds - a.totalSeconds;
        return (a.displayName || a.identifier).localeCompare(b.displayName || b.identifier);
      });
  }, [allApps, searchQuery, sortBy]);

  const maxBytes = useMemo(() => Math.max(1, ...allApps.map((a) => a.totalBytes ?? 0)), [allApps]);

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0 text-ink">Tarmoq Trafigi</h1>
          <p className="text-xs text-muted m-0">Mobil internet, Wi-Fi va Hotspot telemetriyasi</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
          <DeviceFilter devices={devices} value={selectedDeviceId} onChange={setSelectedDeviceId} />
          <DayNav value={selectedDay} onChange={setSelectedDay} />
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={HardDrive}
          label="Jami trafik"
          value={formatBytes(totalBytes)}
          hint={weekdayLabel(selectedDay)}
        />
        <StatCard
          icon={Signal}
          label="Mobil internet"
          value={formatBytes(cellularBytes)}
          hint="SIM-karta orqali"
        />
        <StatCard
          icon={Wifi}
          label="Wi-Fi tarmog'i"
          value={formatBytes(wifiBytes)}
          hint="Simsiz tarmoq"
        />
        <StatCard
          icon={Radio}
          label="Hotspot ulashish"
          value={formatBytes(hotspotBytes)}
          hint="Boshqa qurilmalarga"
        />
      </div>

      {/* Filter and App Breakdown */}
      <Panel>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <PanelHeading icon={Radio} className="mb-0">
            Ilovalar bo'yicha trafik sarfi ({filteredApps.length})
          </PanelHeading>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "bytes" | "duration" | "name")}
              className="text-xs py-1 px-2 rounded-lg border border-border bg-surface text-ink"
            >
              <option value="bytes">Trafik bo'yicha</option>
              <option value="duration">Vaqt bo'yicha</option>
              <option value="name">Nomi bo'yicha</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ilova nomini qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-bg text-ink placeholder:text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {filteredApps.length === 0 ? (
          <EmptyState>Trafik sarfi qayd etilmagan.</EmptyState>
        ) : (
          <div className="divide-y divide-border">
            {filteredApps.map((app) => {
              const appTotal = app.totalBytes ?? 0;
              const percent = maxBytes > 0 ? (appTotal / maxBytes) * 100 : 0;

              return (
                <div key={`${app.appId}:${app.deviceId}`} className="py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AppIcon appId={app.appId} identifier={app.identifier} platform={app.platform} size={22} />
                      <span className="font-semibold text-ink truncate text-xs">{app.displayName || app.identifier}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <span className="font-bold text-ink">{formatBytes(appTotal)}</span>
                      <span className="text-muted text-[11px]">{formatDuration(app.totalSeconds)}</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div style={{ width: `${percent}%` }} className="h-full bg-accent rounded-full transition-all" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                    <span>Mobil: {formatBytes(app.cellularBytes ?? 0)}</span>
                    <span>Wi-Fi: {formatBytes(app.wifiBytes ?? 0)}</span>
                    {app.hotspotBytes ? <span>Hotspot: {formatBytes(app.hotspotBytes)}</span> : null}
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

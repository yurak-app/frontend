import { useState } from "react";
import { Clock, Timer, ArrowLeftRight, Activity, Zap } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getDailyStats, getDevices, type DailyStats, type Device } from "../../api/client";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageTitle } from "../../utils/usePageTitle";
import { formatDateOnly, today, weekdayLabel } from "../../utils/dates";
import { formatDuration } from "../../utils/format";
import { DayNav } from "../../components/ui/DayNav";
import { DeviceFilter } from "../../components/ui/DeviceFilter";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { StatCard } from "../../components/ui/StatCard";
import { SyncBar } from "../../components/ui/SyncBar";
import { ActiveIdleBalance } from "../../components/ActiveIdleBalance";
import { BatteryHistoryPanel } from "../../components/BatteryHistoryPanel";

interface ScreenTimeData {
  daily: DailyStats | null;
  devices: Device[];
}

export function ScreenTimePage() {
  usePageTitle("Ekran vaqti telemetriyasi");
  const { token } = useAuth();

  const todayStr = formatDateOnly(today());
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { data, fetching, error, lastUpdated, reload } = useAsyncData<ScreenTimeData>(
    async () => {
      const deviceId = selectedDeviceId ?? undefined;
      const [daily, devicesRes] = await Promise.all([
        getDailyStats(token!, selectedDay, deviceId),
        getDevices(token!),
      ]);
      return { daily, devices: devicesRes.devices };
    },
    [token, selectedDay, selectedDeviceId],
    {
      enabled: !!token,
      showLoadingOnReload: false,
      fallbackErrorMessage: "Ekran vaqti ma'lumotlarini yuklab bo'lmadi.",
      cacheKey: `screen-time:${selectedDay}:${selectedDeviceId || "all"}`,
    }
  );

  const daily = data?.daily ?? null;
  const devices = data?.devices ?? [];

  const screenSeconds = daily?.apps.reduce((sum, a) => sum + a.totalSeconds, 0) ?? 0;
  const idleSeconds = daily?.idleSeconds ?? 0;
  const switches = daily?.switchCount ?? 0;
  const sessions = daily?.sessionCount ?? 0;
  const chargingSeconds = daily?.activeChargingSeconds ?? 0;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0 text-ink">Ekran Vaqti</h1>
          <p className="text-xs text-muted m-0">Operatsion tizim darajasidagi faol ekran telemetriyasi</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
          <DeviceFilter devices={devices} value={selectedDeviceId} onChange={setSelectedDeviceId} />
          <DayNav value={selectedDay} onChange={setSelectedDay} />
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      {/* Primary KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Timer}
          label="Faol ekran vaqti"
          value={formatDuration(screenSeconds)}
          hint={weekdayLabel(selectedDay)}
        />
        <StatCard
          icon={ArrowLeftRight}
          label="Ilova o'tishlari"
          value={String(switches)}
          hint="Ilovalar almashinuvi"
        />
        <StatCard
          icon={Activity}
          label="Sessiyalar soni"
          value={String(sessions)}
          hint="Ochilishlar soni"
        />
        <StatCard
          icon={Zap}
          label="Quvvatdagi vaqt"
          value={formatDuration(chargingSeconds)}
          hint="Zaryad olayotganda"
        />
      </div>

      {/* Balance panel */}
      {(screenSeconds > 0 || idleSeconds > 0) && (
        <Panel>
          <PanelHeading icon={Activity}>Faollik va Harakatsizlik Nisbati</PanelHeading>
          <ActiveIdleBalance activeSeconds={screenSeconds} idleSeconds={idleSeconds} chargingSeconds={chargingSeconds} />
        </Panel>
      )}

      {/* Device battery history */}
      <BatteryHistoryPanel token={token} devices={devices} date={selectedDay} />

      {/* Explanatory note */}
      <Panel>
        <PanelHeading icon={Clock}>O'lchash Tamoyili</PanelHeading>
        <p className="text-xs text-muted leading-relaxed m-0">
          Ushbu ko'rsatkich faqat ekran faol (interaktiv) bo'lgan va foydalanuvchi ilovalarda ishlagan davrni hisoblaydi. Ekran o'chirilgan yoki qulflangan holatda fon audiolari (masalan, musiqa yoki podkastlar) ekran vaqtiga qo'shilmaydi.
        </p>
      </Panel>
    </div>
  );
}

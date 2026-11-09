import { useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getHeatmap, getRangeStats, type Heatmap, type RangeStats } from "../../api/client";
import { addDays, formatDateOnly, mostRecentMonday, today } from "../../utils/dates";
import { usePageTitle } from "../../utils/usePageTitle";
import { useAsyncData } from "../../hooks/useAsyncData";
import { DayCalendarHeatmap } from "../../components/DayCalendarHeatmap";
import { HourlyHeatmapChart } from "../../components/HourlyHeatmapChart";
import { DayActivityDialog } from "../../components/DayActivityDialog";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { EmptyState } from "../../components/ui/EmptyState";
import { CalendarHeatmapSkeleton, HourlyHeatmapSkeleton } from "../../components/HistorySkeleton";

const CALENDAR_WEEKS = 52; // 1 year

interface HistoryData {
  range: RangeStats;
  heatmap: Heatmap;
}

export function HistoryPage() {
  usePageTitle("Faollik Tarixi — Yurak");
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, loading, error } = useAsyncData<HistoryData>(
    async () => {
      const end = formatDateOnly(today());
      const start = formatDateOnly(addDays(today(), -(CALENDAR_WEEKS * 7 - 1)));
      const [range, heatmap] = await Promise.all([getRangeStats(token!, start, end), getHeatmap(token!, 28)]);
      return { range, heatmap };
    },
    [token],
    {
      enabled: !!token,
      showLoadingOnReload: false,
      fallbackErrorMessage: "Tarix ma'lumotlarini yuklab bo'lmadi.",
      cacheKey: "history",
    }
  );

  const totalsByDate = useMemo(() => new Map((data?.range.daily ?? []).map((d) => [d.date, d.totalSeconds])), [data]);

  const gridStart = useMemo(() => {
    const end = today();
    const endMonday = mostRecentMonday(end);
    return addDays(endMonday, -(CALENDAR_WEEKS - 1) * 7);
  }, []);

  const hasCalendarActivity = totalsByDate.size > 0 && [...totalsByDate.values()].some((v) => v > 0);
  const hasHeatmapActivity = data && data.heatmap.cells.some((row) => row.some((v) => v > 0));

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold m-0 text-ink">Faollik Tarixi</h1>
        <p className="text-xs text-muted m-0">O'tgan davrdagi faollik xaritasi va soatlik taqsimot</p>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        <PanelHeading icon={CalendarDays}>Yillik Faollik Kalendari</PanelHeading>
        {loading ? (
          <CalendarHeatmapSkeleton />
        ) : !hasCalendarActivity ? (
          <EmptyState>O'tgan davrda hech qanday faollik qayd etilmagan.</EmptyState>
        ) : (
          <DayCalendarHeatmap gridStart={gridStart} weeks={CALENDAR_WEEKS} totalsByDate={totalsByDate} onSelectDate={setSelectedDate} />
        )}
      </Panel>

      <Panel>
        <PanelHeading icon={Clock3}>Soatlik Faollik Taqsimoti (Oxirgi 4 hafta)</PanelHeading>
        {loading ? (
          <HourlyHeatmapSkeleton />
        ) : !hasHeatmapActivity ? (
          <EmptyState>Soatlik taqsimot ma'lumotlari mavjud emas.</EmptyState>
        ) : (
          <HourlyHeatmapChart cells={data.heatmap.cells} />
        )}
      </Panel>

      {selectedDate && <DayActivityDialog token={token!} date={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
}

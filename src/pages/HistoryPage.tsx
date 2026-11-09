import { useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getHeatmap, getRangeStats, type Heatmap, type RangeStats } from "../api/client";
import { addDays, formatDateOnly, mostRecentMonday, today } from "../utils/dates";
import { usePageTitle } from "../utils/usePageTitle";
import { useAsyncData } from "../hooks/useAsyncData";
import { DayCalendarHeatmap } from "../components/DayCalendarHeatmap";
import { HourlyHeatmapChart } from "../components/HourlyHeatmapChart";
import { DayActivityDialog } from "../components/DayActivityDialog";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { EmptyState } from "../components/ui/EmptyState";
import { CalendarHeatmapSkeleton, HourlyHeatmapSkeleton } from "../components/HistorySkeleton";

const CALENDAR_WEEKS = 52; // 1 year

interface HistoryData {
  range: RangeStats;
  heatmap: Heatmap;
}

/** Two different "when" questions the daily/weekly views don't answer: which
 * days over the last few months were busy (calendar heatmap), and which hours
 * of the week you actually tend to be at your computer (hourly heatmap). */
export function HistoryPage() {
  usePageTitle("History");
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
    { enabled: !!token, fallbackErrorMessage: "Couldn't load history.", cacheKey: "history" }
  );

  const totalsByDate = useMemo(() => new Map((data?.range.daily ?? []).map((d) => [d.date, d.totalSeconds])), [data]);

  const gridStart = useMemo(() => {
    const end = today();
    const endMonday = mostRecentMonday(end);
    return addDays(endMonday, -(CALENDAR_WEEKS - 1) * 7);
  }, []);

  const hasCalendarActivity = totalsByDate.size > 0 && [...totalsByDate.values()].some((v) => v > 0);
  const hasHeatmapActivity = data ? data.heatmap.cells.some((row) => row.some((v) => v > 0)) : false;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold m-0">History</h1>
        <p className="text-sm text-muted mt-1 mb-0">The last year, at a glance.</p>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        <PanelHeading icon={CalendarDays}>Activity by day</PanelHeading>
        {loading ? (
          <CalendarHeatmapSkeleton />
        ) : !hasCalendarActivity ? (
          <EmptyState>No activity recorded yet.</EmptyState>
        ) : (
          <DayCalendarHeatmap
            gridStart={gridStart}
            weeks={CALENDAR_WEEKS}
            totalsByDate={totalsByDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </Panel>

      <Panel>
        <PanelHeading icon={Clock3}>When you're active</PanelHeading>
        <p className="text-xs text-muted mt-0 mb-4">Total time by hour of day, over the last 4 weeks.</p>
        {loading ? (
          <HourlyHeatmapSkeleton />
        ) : !hasHeatmapActivity ? (
          <EmptyState>No activity recorded yet.</EmptyState>
        ) : (
          <HourlyHeatmapChart cells={data!.heatmap.cells} />
        )}
      </Panel>

      <DayActivityDialog date={selectedDate} token={token} onClose={() => setSelectedDate(null)} />
    </div>
  );
}

import { useMemo, useState } from "react";
import { CalendarRange, Clock } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getWeeklyReport, type WeeklyReport } from "../api/client";
import { addDays, formatDateOnly, formatWeekRange, mostRecentMonday, parseDateOnly, today, weekNumberOf } from "../utils/dates";
import { formatDuration } from "../utils/format";
import { usePageTitle } from "../utils/usePageTitle";
import { useAsyncData } from "../hooks/useAsyncData";
import { ActiveIdleBalance } from "../components/ActiveIdleBalance";
import { WeeklyBarChart } from "../components/WeeklyBarChart";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { BarChartSkeleton } from "../components/BarChartSkeleton";
import { BalanceSkeleton } from "../components/WeeklyReportSkeleton";

/** A phone-style "weekly report": this week's daily totals against a trailing
 * 4-week baseline per weekday, plus an active-vs-idle time balance for the week. */
export function WeeklyReportPage() {
  usePageTitle("Weekly report");
  const { token } = useAuth();

  const thisWeekStart = formatDateOnly(mostRecentMonday(today()));
  const [selectedStart, setSelectedStart] = useState(thisWeekStart);

  const { data: report, loading, error } = useAsyncData<WeeklyReport>(
    () => getWeeklyReport(token!, selectedStart),
    [token, selectedStart],
    { enabled: !!token, fallbackErrorMessage: "Couldn't load the weekly report.", cacheKey: `weekly-report:${selectedStart}` }
  );

  // Always 4 pills — 2 weeks before the selected one, the selected one, and 1 after
  // (disabled once it's in the future) — slides as you navigate, same idea as a
  // horizontally-scrolling week strip without needing actual scroll state.
  const weekPills = useMemo(() => {
    const center = parseDateOnly(selectedStart);
    return [-2, -1, 0, 1].map((offset) => formatDateOnly(addDays(center, offset * 7)));
  }, [selectedStart]);

  // Same "This week"/"Last week"/date-range wording as the dashboard's own week
  // label, driven by the selected week's distance from the real current one.
  const weeksAgo = Math.round(
    (parseDateOnly(thisWeekStart).getTime() - parseDateOnly(selectedStart).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  const weekLabel =
    weeksAgo === 0
      ? "This week"
      : weeksAgo === 1
        ? "Last week"
        : report
          ? formatWeekRange(report.weekStart, report.weekEnd)
          : "";

  const activeSeconds = report?.activeAverageSeconds ?? 0;
  const inactiveSeconds = report?.inactiveAverageSeconds ?? 0;
  const hasActivity = report && report.days.some((d) => d.totalSeconds > 0);

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0">Weekly report</h1>
          {report && (
            <p className="text-sm text-muted mt-1 mb-0">
              {weekLabel} · Week {report.weekNumber}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {weekPills.map((start) => {
            const isFuture = start > thisWeekStart;
            return (
              <button
                key={start}
                type="button"
                disabled={isFuture}
                onClick={() => setSelectedStart(start)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-30 disabled:cursor-default ${
                  start === selectedStart
                    ? "bg-accent text-white border-accent"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                W{weekNumberOf(parseDateOnly(start))}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        <PanelHeading icon={Clock}>Screen time by week</PanelHeading>
        {loading ? (
          <>
            <Skeleton style={{ width: 110, height: 34, marginBottom: 4 }} />
            <Skeleton style={{ width: 150, height: 11, marginBottom: 20 }} />
            <BarChartSkeleton />
          </>
        ) : !hasActivity ? (
          <EmptyState>No activity recorded this week.</EmptyState>
        ) : (
          <>
            <p className="text-[2.1rem] font-bold mb-1 tabular-nums">{formatDuration(report!.dailyAverageSeconds)}</p>
            <p className="text-xs text-muted mb-5">Daily average screen time</p>
            <WeeklyBarChart days={report!.days} baseline={report!.dayOfWeekAverages} avgSeconds={report!.dailyAverageSeconds} />
            <div className="flex flex-col gap-1.5 mt-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent shrink-0" /> Daily screen time
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-border shrink-0" /> Monthly average by day of week
              </span>
            </div>
          </>
        )}
      </Panel>

      {(loading || hasActivity) && (
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <PanelHeading icon={CalendarRange} className="mb-0">
              Balance
            </PanelHeading>
            <span className="text-xs text-muted">Daily average</span>
          </div>
          {loading ? <BalanceSkeleton /> : <ActiveIdleBalance activeSeconds={activeSeconds} idleSeconds={inactiveSeconds} />}
        </Panel>
      )}
    </div>
  );
}

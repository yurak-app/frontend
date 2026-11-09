import { useMemo, useState } from "react";
import { CalendarRange, Clock } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getWeeklyReport, type WeeklyReport } from "../../api/client";
import { addDays, formatDateOnly, formatWeekRange, mostRecentMonday, parseDateOnly, today, weekNumberOf } from "../../utils/dates";
import { usePageTitle } from "../../utils/usePageTitle";
import { useAsyncData } from "../../hooks/useAsyncData";
import { ActiveIdleBalance } from "../../components/ActiveIdleBalance";
import { WeeklyBarChart } from "../../components/WeeklyBarChart";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { EmptyState } from "../../components/ui/EmptyState";
import { BarChartSkeleton } from "../../components/BarChartSkeleton";
import { BalanceSkeleton } from "../../components/WeeklyReportSkeleton";

export function WeeklyReportPage() {
  usePageTitle("Haftalik hisobot — Yurak");
  const { token } = useAuth();

  const thisWeekStart = formatDateOnly(mostRecentMonday(today()));
  const [selectedStart, setSelectedStart] = useState(thisWeekStart);

  const { data: report, loading, error } = useAsyncData<WeeklyReport>(
    () => getWeeklyReport(token!, selectedStart),
    [token, selectedStart],
    { enabled: !!token, fallbackErrorMessage: "Haftalik hisobotni yuklab bo'lmadi.", cacheKey: `weekly-report:${selectedStart}` }
  );

  const weekPills = useMemo(() => {
    const center = parseDateOnly(selectedStart);
    return [-2, -1, 0, 1].map((offset) => formatDateOnly(addDays(center, offset * 7)));
  }, [selectedStart]);

  const weeksAgo = Math.round(
    (parseDateOnly(thisWeekStart).getTime() - parseDateOnly(selectedStart).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  const weekLabel =
    weeksAgo === 0
      ? "Joriy hafta"
      : weeksAgo === 1
        ? "O'tgan hafta"
        : formatWeekRange(selectedStart, formatDateOnly(addDays(parseDateOnly(selectedStart), 6)));

  const hasActivity = report && report.days.some((d) => d.totalSeconds > 0);

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0 text-ink">Haftalik Hisobot</h1>
          <p className="text-xs text-muted m-0">{weekLabel} tahlili</p>
        </div>

        {/* Week pill navigator */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border">
          {weekPills.map((startStr) => {
            const isFuture = startStr > thisWeekStart;
            const isSelected = startStr === selectedStart;
            const label = `Hafta ${weekNumberOf(parseDateOnly(startStr))}`;

            return (
              <button
                key={startStr}
                type="button"
                disabled={isFuture}
                onClick={() => setSelectedStart(startStr)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isSelected
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : isFuture
                      ? "text-muted/40 cursor-not-allowed"
                      : "text-muted hover:text-ink hover:bg-bg"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        <PanelHeading icon={CalendarRange}>Haftalik Faollik va Solishtirma</PanelHeading>
        {loading ? (
          <BarChartSkeleton />
        ) : !hasActivity ? (
          <EmptyState>Ushbu haftada hech qanday faollik qayd etilmagan.</EmptyState>
        ) : (
          <WeeklyBarChart
            days={report.days}
            baseline={report.dayOfWeekAverages}
            avgSeconds={report.dailyAverageSeconds}
          />
        )}
      </Panel>

      <Panel>
        <PanelHeading icon={Clock}>Faollik va Dam Olish Balansi</PanelHeading>
        {loading ? (
          <BalanceSkeleton />
        ) : !hasActivity ? (
          <EmptyState>Balans ma'lumotlari mavjud emas.</EmptyState>
        ) : (
          <ActiveIdleBalance
            activeSeconds={report.activeAverageSeconds}
            idleSeconds={report.inactiveAverageSeconds}
            chargingSeconds={0}
          />
        )}
      </Panel>
    </div>
  );
}

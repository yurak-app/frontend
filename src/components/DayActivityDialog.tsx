import { useMemo } from "react";
import { AppWindow, Globe } from "lucide-react";
import { Dialog } from "./Dialog";
import { EmptyState } from "./ui/EmptyState";
import { PanelHeading } from "./ui/PanelHeading";
import { AppBarRow } from "./AppBarRow";
import { AppBarRowSkeleton } from "./AppBarRowSkeleton";
import { getDailyStats, type AppStat, type DailyStats } from "../api/client";
import { addDays, formatDateOnly, isDifferentYear, parseDateOnly, today } from "../utils/dates";
import { formatBytes, formatDuration } from "../utils/format";
import { useAsyncData } from "../hooks/useAsyncData";

interface DayActivityDialogProps {
  date: string | null;
  token: string | null;
  onClose: () => void;
  /** Matches whatever the dashboard's device filter was set to when this was
   * opened — "View all apps" should show the same scope you were already looking
   * at, not silently widen back out to every device. */
  deviceId?: string | null;
}

/** One labeled group of app rows, scaled against its own max — a 2-minute browser
 * session shouldn't render as a hairline next to hours of desktop use, so each
 * section gets its own bar scale, same as the dashboard's separate panels do. */
function AppSection({
  icon,
  label,
  apps,
  showDevice,
}: {
  icon: typeof AppWindow;
  label: string;
  apps: AppStat[];
  showDevice: boolean;
}) {
  if (apps.length === 0) return null;
  const total = apps.reduce((sum, a) => sum + a.totalSeconds, 0);
  const totalBytes = apps.reduce((sum, a) => sum + (a.totalBytes ?? 0), 0);
  const maxSeconds = Math.max(1, ...apps.map((a) => a.totalSeconds));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <PanelHeading icon={icon} className="mb-0">
          {label}
        </PanelHeading>
        <span className="text-xs text-muted tabular-nums shrink-0">
          {formatDuration(total)}
          {totalBytes > 0 && ` · ${formatBytes(totalBytes)}`}
        </span>
      </div>
      {apps.map((app) => (
        <AppBarRow key={`${app.appId}:${app.deviceId}`} app={app} maxSeconds={maxSeconds} showDevice={showDevice} showSessions />
      ))}
    </div>
  );
}

/**
 * Per-app time breakdown for one day — the same shape as the dashboard's own
 * "Today" panels, just for whichever day was picked (today's "view all", or a
 * bar clicked on the 7-day chart). Deliberately app-level, not a raw event
 * timeline: a full day's worth of individual foreground-window segments reads
 * as noise, not information. Split into "Apps" and "Browser" sections — same
 * separation as the dashboard's Top Apps / Browser Activity panels, so a day
 * that was mostly browsing doesn't get its handful of sites drowned out by
 * (or, just as misleadingly, ranked alongside) hours of desktop app usage.
 */
export function DayActivityDialog({ date, token, onClose, deviceId = null }: DayActivityDialogProps) {
  const { data, loading, error } = useAsyncData<DailyStats>(
    () => getDailyStats(token!, date!, deviceId ?? undefined),
    [date, token, deviceId],
    {
      enabled: !!date && !!token,
      fallbackErrorMessage: "Couldn't load that day.",
      cacheKey: date ? `day-activity:${date}:${deviceId ?? "all"}` : undefined,
    }
  );

  const apps = useMemo(() => [...(data?.apps ?? [])].sort((a, b) => b.totalSeconds - a.totalSeconds), [data]);
  const desktopApps = useMemo(() => apps.filter((a) => a.platform !== "extension"), [apps]);
  const browserApps = useMemo(() => apps.filter((a) => a.platform === "extension"), [apps]);
  const switchCount = data?.switchCount ?? 0;
  const sessionCount = data?.sessionCount ?? 0;

  const isToday = date === formatDateOnly(today());
  const isYesterday = date === formatDateOnly(addDays(today(), -1));
  const title = date
    ? isToday
      ? "Today's activity"
      : isYesterday
        ? "Yesterday's activity"
        : parseDateOnly(date).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            ...(isDifferentYear(parseDateOnly(date)) ? { year: "numeric" } : {}),
          })
    : "";

  const total = apps.reduce((sum, a) => sum + a.totalSeconds, 0);
  const showDevice = new Set(apps.map((a) => a.deviceId)).size > 1;

  return (
    <Dialog
      open={date !== null}
      onClose={onClose}
      title={title}
      size="lg"
      subtitle={
        !loading && !error && apps.length > 0
          ? `${formatDuration(total)}${
              data?.totalBytes ? ` · ${formatBytes(data.totalBytes)}` : ""
            } across ${apps.length} app${apps.length === 1 ? "" : "s"} · ${
              sessionCount > 0 ? `${sessionCount} session${sessionCount === 1 ? "" : "s"} · ` : ""
            }${switchCount} switch${switchCount === 1 ? "" : "es"}`
          : undefined
      }
    >
      {loading && (
        <div className="flex flex-col gap-2">{[90, 70, 50, 65, 35].map((width, i) => <AppBarRowSkeleton key={i} barWidth={width} />)}</div>
      )}
      {error && <p className="text-danger text-sm m-0">{error}</p>}
      {!loading && !error && apps.length === 0 && <EmptyState>No activity recorded this day.</EmptyState>}
      {!loading && !error && apps.length > 0 && (
        <div className="flex flex-col gap-5">
          <AppSection icon={AppWindow} label="Apps" apps={desktopApps} showDevice={showDevice} />
          {desktopApps.length > 0 && browserApps.length > 0 && <div className="border-t border-border" />}
          <AppSection icon={Globe} label="Browser" apps={browserApps} showDevice={showDevice} />
        </div>
      )}
    </Dialog>
  );
}

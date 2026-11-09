import type { AppStat } from "../api/client";
import { formatBytes, formatDuration } from "../utils/format";
import { AppIcon } from "./ui/AppIcon";

/** One row in an app-usage bar list — used on the dashboard and in the device-details dialog. */
export function AppBarRow({
  app,
  maxSeconds,
  showDevice,
  showSessions = false,
}: {
  app: AppStat;
  maxSeconds: number;
  showDevice: boolean;
  /** Show the session count ("4 sessions") under the duration — off where it'd be noise (device details). */
  showSessions?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr_52px] items-center gap-3 py-1.5">
      <span className="flex items-center gap-1.5 text-sm truncate">
        <AppIcon appId={app.appId} identifier={app.identifier} platform={app.platform} />
        <span className="truncate">
          {app.displayName ?? app.identifier}
          {showDevice && <span className="text-muted font-normal"> · {app.deviceName}</span>}
        </span>
      </span>
      <div className="h-2 bg-border rounded overflow-hidden">
        <div
          className="h-full bg-accent rounded min-w-[3px] transition-[width] duration-500 ease-out"
          style={{ width: `${(app.totalSeconds / maxSeconds) * 100}%` }}
        />
      </div>
      <span className="text-right tabular-nums leading-tight">
        <span className="block text-xs text-muted">{formatDuration(app.totalSeconds)}</span>
        {app.totalBytes != null && app.totalBytes > 0 ? (
          <span className="block text-[10px] text-accent font-medium">
            {formatBytes(app.totalBytes)}
          </span>
        ) : showSessions && app.sessionCount > 0 ? (
          <span className="block text-[10px] text-muted/70">
            {app.sessionCount} session{app.sessionCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </span>
    </div>
  );
}

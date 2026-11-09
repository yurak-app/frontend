import type { Device } from "../api/client";
import { formatRelativeTime, isDeviceOnline } from "../utils/format";
import { platformIcon } from "../utils/platformIcon";
import { StatusDot } from "./ui/StatusDot";
import { BatteryBadge } from "./ui/BatteryBadge";

/** One card in the devices grid — click for the full detail dialog. */
export function DeviceRow({ device, onClick }: { device: Device; onClick: () => void }) {
  const online = !device.revokedAt && isDeviceOnline(device.lastSeenAt);
  const PlatformIcon = platformIcon(device.platform);
  const statusLabel = device.revokedAt ? "Revoked" : online ? "Online now" : `Last seen ${formatRelativeTime(device.lastSeenAt)}`;

  return (
    <button
      type="button"
      className="flex items-center gap-3.5 p-4 bg-surface border border-border rounded-2xl text-left font-inherit text-inherit cursor-pointer hover:border-accent/40 hover:bg-bg hover:-translate-y-0.5 active:scale-[0.99] transition-[transform,background-color,border-color] duration-200"
      onClick={onClick}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
          device.revokedAt ? "bg-bg text-muted" : "bg-accent/10 text-accent"
        }`}
      >
        <PlatformIcon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{device.name}</div>
        <div className="flex items-center gap-1.5 text-xs text-muted mt-1 min-w-0">
          {!device.revokedAt && <StatusDot online={online} />}
          <span className="truncate">{statusLabel}</span>
        </div>
      </div>
      {/* platform check is belt-and-suspenders — see BatteryHistoryPanel's own comment
          on the same filter for why a browser has no separate battery to show at all. */}
      {!device.revokedAt && device.platform !== "extension" && device.batteryLevel !== null && (
        <BatteryBadge level={device.batteryLevel} charging={device.isCharging} />
      )}
    </button>
  );
}

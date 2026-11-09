import { Battery, BatteryCharging } from "lucide-react";

/** Compact "76% · Charging" indicator — reused on the devices list and device details dialog. */
export function BatteryBadge({ level, charging }: { level: number; charging: boolean | null }) {
  const Icon = charging ? BatteryCharging : Battery;
  return (
    <span className={`inline-flex items-center gap-1 text-xs tabular-nums ${charging ? "text-good" : "text-muted"}`}>
      <Icon size={13} className={charging ? "animate-pulse" : ""} />
      {level}%
    </span>
  );
}

import { ChevronDown } from "lucide-react";
import type { Device } from "../../api/client";

const PLATFORM_LABEL: Record<Device["platform"], string> = {
  windows: "Windows",
  android: "Android",
  extension: "Browser",
};

/**
 * "All devices" (combined, the default) vs. one specific device — the same
 * filter every stats-driving panel on the dashboard reads. A plain native
 * `<select>` on purpose: it scales to however many devices an account ends up
 * with (today a Windows PC + the browser extension; the plan is Android too,
 * and possibly more than one Windows PC) with zero extra work — a custom
 * dropdown would need its own scroll/overflow handling once the list gets
 * long, a native one already has that for free.
 *
 * Hidden entirely with 0-1 devices — nothing to filter between yet.
 */
export function DeviceFilter({
  devices,
  value,
  onChange,
}: {
  devices: Device[];
  value: string | null;
  onChange: (deviceId: string | null) => void;
}) {
  const activeDevices = devices.filter((d) => !d.revokedAt);
  if (activeDevices.length <= 1) return null;

  return (
    <div className="relative flex items-center shrink-0">
      <select
        value={value ?? "all"}
        onChange={(e) => onChange(e.target.value === "all" ? null : e.target.value)}
        aria-label="Filter by device"
        className="appearance-none pl-3 pr-7 py-1.5 rounded-full border border-border bg-transparent text-ink text-xs font-medium cursor-pointer hover:border-accent transition-colors focus:outline-2 focus:outline-accent focus:-outline-offset-1"
      >
        <option value="all">All devices</option>
        {activeDevices.map((d) => (
          <option key={d.id} value={d.id}>
            {PLATFORM_LABEL[d.platform]} — {d.name}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-muted" />
    </div>
  );
}

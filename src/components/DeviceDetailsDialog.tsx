import { useState } from "react";
import {
  BadgeCheck,
  Binary,
  CalendarDays,
  ChevronDown,
  Cpu,
  Fingerprint,
  HardDrive,
  KeyRound,
  Laptop,
  Layers,
  MapPin,
  MemoryStick,
  MonitorPlay,
  RefreshCw,
  Tag,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Dialog } from "./Dialog";
import { EmptyState } from "./ui/EmptyState";
import { Button } from "./ui/Button";
import { StatusDot } from "./ui/StatusDot";
import { BatteryBadge } from "./ui/BatteryBadge";
import { DeviceLocationMap } from "./DeviceLocationMap";
import { PanelHeading } from "./ui/PanelHeading";
import { Collapse } from "./ui/Collapse";
import type { Device } from "../api/client";
import { formatDate, formatRelativeTime, isDeviceOnline } from "../utils/format";
import { platformIcon } from "../utils/platformIcon";

interface DeviceDetailsDialogProps {
  device: Device | null;
  onClose: () => void;
  onRevoke: (device: Device) => Promise<void>;
  revoking: boolean;
  /** Re-fetches the device list — the agent reports location on its own every
   * 15 minutes, this just pulls the latest stored value in without waiting
   * for the page's own poll or closing/reopening the dialog. */
  onRefresh?: () => Promise<void> | void;
}

const SPEC_ICONS: Record<string, LucideIcon> = {
  "Device name": Laptop,
  Processor: Cpu,
  "Installed RAM": MemoryStick,
  "Graphics card": MonitorPlay,
  Storage: HardDrive,
  "Device ID": Fingerprint,
  "Product ID": KeyRound,
  "System type": Binary,
};

const WINDOWS_SPEC_ICONS: Record<string, LucideIcon> = {
  Edition: BadgeCheck,
  Version: Tag,
  "Installed on": CalendarDays,
  "OS build": Layers,
};

const DEVICE_SPEC_ORDER = Object.keys(SPEC_ICONS);
const WINDOWS_SPEC_ORDER = Object.keys(WINDOWS_SPEC_ICONS);

// What LocationService on the Windows side actually resolved through — GPS is
// requested first, but Windows silently falls back to whichever of these is
// available (no GPS radio on most desktops/laptops), so this is what really
// happened, not a claim we're choosing to make. `precise` picks the badge's
// tone: GPS gets the accent color, everything else a neutral one.
const LOCATION_SOURCE_INFO: Record<string, { label: string; precise: boolean }> = {
  gps: { label: "GPS", precise: true },
  wifi: { label: "Wi-Fi", precise: false },
  cellular: { label: "Cellular", precise: false },
  ip: { label: "IP address", precise: false },
  unknown: { label: "Unknown source", precise: false },
};

function parseStorage(value: string): { usedGb: number; totalGb: number } | null {
  const match = value.match(/^(\d+(?:\.\d+)?)\s*GB of (\d+(?:\.\d+)?)\s*GB/i);
  if (!match) return null;
  return { usedGb: parseFloat(match[1]), totalGb: parseFloat(match[2]) };
}

function LocationSourceBadge({ source }: { source: string | null }) {
  const info = source ? LOCATION_SOURCE_INFO[source] : undefined;
  if (!info) return null;
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
        info.precise ? "bg-accent/10 text-accent" : "bg-bg text-muted"
      }`}
    >
      {info.label}
    </span>
  );
}

function SpecTile({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  const storage = label === "Storage" ? parseStorage(value) : null;
  return (
    <div className="bg-bg rounded-xl p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-wide text-muted font-semibold mb-1.5">
        <Icon size={12} /> {label}
      </div>
      <div className="text-[0.83rem] font-medium whitespace-pre-line break-words">{value}</div>
      {storage && (
        <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, (storage.usedGb / storage.totalGb) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

/** Collapsible so a dialog that now also carries a map and location badge
 * doesn't force scrolling past specs you already know just to reach revoke. */
function SpecGroup({ title, keys, icons, info }: { title: string; keys: string[]; icons: Record<string, LucideIcon>; info: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  if (keys.length === 0) return null;
  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 py-2.5 bg-transparent border-none cursor-pointer text-left"
        aria-expanded={open}
      >
        <h4 className="text-xs uppercase tracking-wider text-muted mb-0 font-semibold">{title}</h4>
        <ChevronDown size={14} className={`text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <Collapse open={open}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2.5">
          {keys.map((key) => (
            <SpecTile key={key} label={key} value={info[key]} icon={icons[key]} />
          ))}
        </div>
      </Collapse>
    </div>
  );
}

export function DeviceDetailsDialog({ device, onClose, onRevoke, revoking, onRefresh }: DeviceDetailsDialogProps) {
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (!device) return null;

  async function handleRefresh() {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  const online = !device.revokedAt && isDeviceOnline(device.lastSeenAt);
  const PlatformIcon = platformIcon(device.platform);
  const info = device.systemInfo ?? {};

  const deviceSpecs = DEVICE_SPEC_ORDER.filter((key) => key in info);
  const windowsSpecs = WINDOWS_SPEC_ORDER.filter((key) => key in info);
  const otherSpecs = Object.keys(info).filter(
    (key) => !DEVICE_SPEC_ORDER.includes(key) && !WINDOWS_SPEC_ORDER.includes(key)
  );

  function handleClose() {
    setConfirmingRevoke(false);
    onClose();
  }

  return (
    <Dialog open onClose={handleClose} title={device.name} size="lg">
      <div className="flex items-center gap-3.5 pb-4 mb-1 border-b border-border">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            device.revokedAt ? "bg-bg text-muted" : "bg-accent/10 text-accent"
          }`}
        >
          <PlatformIcon size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-base truncate">{device.name}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {device.revokedAt ? (
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-danger/10 text-danger">
                Revoked
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  online ? "bg-good/10 text-good" : "bg-bg text-muted"
                }`}
              >
                <StatusDot online={online} /> {online ? "Online now" : `Last seen ${formatRelativeTime(device.lastSeenAt)}`}
              </span>
            )}
            <span className="text-xs text-muted">Registered {formatDate(device.createdAt)}</span>
          </div>
        </div>
        {/* platform check is belt-and-suspenders — see BatteryHistoryPanel's comment on
            the same filter for why a browser has no separate battery to show at all. */}
        {!device.revokedAt && device.platform !== "extension" && device.batteryLevel !== null && (
          <div className="shrink-0">
            <BatteryBadge level={device.batteryLevel} charging={device.isCharging} />
          </div>
        )}
      </div>

      {deviceSpecs.length === 0 && windowsSpecs.length === 0 ? (
        <EmptyState>
          {device.platform === "windows"
            ? "No specs reported yet — they're sent once the agent logs in."
            : device.platform === "extension"
              ? "The browser extension doesn't report hardware specs."
              : "This platform doesn't report hardware specs."}
        </EmptyState>
      ) : (
        <>
          <SpecGroup title="Device" keys={deviceSpecs} icons={SPEC_ICONS} info={info} />
          <SpecGroup title="Windows" keys={windowsSpecs} icons={WINDOWS_SPEC_ICONS} info={info} />
          {otherSpecs.length > 0 && (
            <>
              <h4 className="text-xs uppercase tracking-wider text-muted mt-5 mb-2.5 font-semibold">Other</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {otherSpecs.map((key) => (
                  <div key={key} className="bg-bg rounded-xl p-3 min-w-0">
                    <div className="text-[0.68rem] uppercase tracking-wide text-muted font-semibold mb-1.5">{key}</div>
                    <div className="text-[0.83rem] font-medium break-words">{info[key]}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {device.latitude !== null && device.longitude !== null && (
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <PanelHeading icon={MapPin} className="mb-0">
                Location
              </PanelHeading>
              <LocationSourceBadge source={device.locationSource} />
            </div>
            <div className="flex items-center gap-2">
              {device.locationUpdatedAt && (
                <span className="text-xs text-muted">as of {formatRelativeTime(device.locationUpdatedAt)}</span>
              )}
              {onRefresh && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-1 rounded hover:bg-bg hover:text-ink text-muted transition-colors disabled:opacity-50"
                  aria-label="Refresh location"
                  title="Refresh location"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          </div>
          <DeviceLocationMap latitude={device.latitude} longitude={device.longitude} />
        </div>
      )}

      {!device.revokedAt && (
        <div className="mt-5 pt-4 border-t border-border">
          {confirmingRevoke ? (
            <div className="flex flex-col gap-2.5 text-sm">
              <span>Revoke this device? It'll need to log in again.</span>
              <div className="flex gap-2.5">
                <Button className="flex-1" onClick={() => setConfirmingRevoke(false)}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" disabled={revoking} onClick={() => onRevoke(device)}>
                  {revoking ? "Revoking…" : "Yes, revoke"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button variant="danger" onClick={() => setConfirmingRevoke(true)}>
                <Trash2 size={14} /> Revoke this device
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ApiError, getDevices, revokeDevice, type Device } from "../api/client";
import { usePageTitle } from "../utils/usePageTitle";
import { isDeviceOnline } from "../utils/format";
import { invalidateAll } from "../utils/requestCache";
import { useAsyncData } from "../hooks/useAsyncData";
import { DeviceDetailsDialog } from "../components/DeviceDetailsDialog";
import { DevicesSkeleton } from "../components/DevicesSkeleton";
import { DeviceRow } from "../components/DeviceRow";
import { Panel } from "../components/ui/Panel";
import { SyncBar } from "../components/ui/SyncBar";
import { EmptyState } from "../components/ui/EmptyState";

export function DevicesPage() {
  usePageTitle("Devices");
  const { token } = useAuth();

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { data, loading, fetching, error, setError, lastUpdated, reload } = useAsyncData(
    () => getDevices(token!).then((res) => res.devices),
    [token],
    { enabled: !!token, showLoadingOnReload: false, fallbackErrorMessage: "Couldn't load your devices.", cacheKey: "devices" }
  );
  const devices = data ?? [];

  async function handleRevoke(device: Device) {
    if (!token) return;
    setRevokingId(device.id);
    try {
      await revokeDevice(token, device.id);
      // Beyond this page's own list (which `reload` below refreshes directly): the
      // dashboard's device filter and its combined fetch both embed the device
      // list too, and shouldn't keep offering/reflecting a device just revoked.
      invalidateAll();
      await reload();
      setSelectedDeviceId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't revoke that device.");
    } finally {
      setRevokingId(null);
    }
  }

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;
  const onlineCount = devices.filter((d) => !d.revokedAt && isDeviceOnline(d.lastSeenAt)).length;

  if (loading) return <DevicesSkeleton />;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0">Devices</h1>
          <p className="text-sm text-muted mt-1 mb-0">
            {devices.length === 0
              ? "No devices have logged in yet."
              : `${devices.length} device${devices.length === 1 ? "" : "s"} · ${onlineCount} online now`}
          </p>
        </div>
        <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      {devices.length === 0 ? (
        <Panel>
          <EmptyState>No devices have logged in yet — sign in from the Windows or Android agent.</EmptyState>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {devices.map((device) => (
            <DeviceRow key={device.id} device={device} onClick={() => setSelectedDeviceId(device.id)} />
          ))}
        </div>
      )}

      <DeviceDetailsDialog
        device={selectedDevice}
        onClose={() => setSelectedDeviceId(null)}
        onRevoke={handleRevoke}
        revoking={revokingId === selectedDeviceId}
        onRefresh={reload}
      />
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { ApiError, getDevices, revokeDevice, type Device } from "../../api/client";
import { usePageTitle } from "../../utils/usePageTitle";
import { isDeviceOnline } from "../../utils/format";
import { invalidateAll } from "../../utils/requestCache";
import { useAsyncData } from "../../hooks/useAsyncData";
import { DeviceDetailsDialog } from "../../components/DeviceDetailsDialog";
import { DevicesSkeleton } from "../../components/DevicesSkeleton";
import { DeviceRow } from "../../components/DeviceRow";
import { Panel } from "../../components/ui/Panel";
import { SyncBar } from "../../components/ui/SyncBar";
import { EmptyState } from "../../components/ui/EmptyState";

export function DevicesPage() {
  usePageTitle("Ulangan qurilmalar — Yurak");
  const { token } = useAuth();

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const { data, loading, fetching, error, setError, lastUpdated, reload } = useAsyncData(
    () => getDevices(token!).then((res) => res.devices),
    [token],
    { enabled: !!token, showLoadingOnReload: false, fallbackErrorMessage: "Qurilmalarni yuklab bo'lmadi.", cacheKey: "devices" }
  );
  const devices = data ?? [];

  async function handleRevoke(device: Device) {
    if (!token) return;
    setRevokingId(device.id);
    try {
      await revokeDevice(token, device.id);
      invalidateAll();
      await reload();
      setSelectedDeviceId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Qurilmani uzib bo'lmadi.");
    } finally {
      setRevokingId(null);
    }
  }

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;
  const onlineCount = devices.filter((d) => !d.revokedAt && isDeviceOnline(d.lastSeenAt)).length;

  if (loading) return <DevicesSkeleton />;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0 text-ink">Qurilmalar</h1>
          <p className="text-xs text-muted m-0">
            {devices.length} ta ro'yxatga olingan qurilma ({onlineCount} tasi ayni paytda onlayn)
          </p>
        </div>
        <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        {devices.length === 0 ? (
          <EmptyState>Ulangan qurilmalar mavjud emas.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                onClick={() => setSelectedDeviceId(device.id)}
              />
            ))}
          </div>
        )}
      </Panel>

      {selectedDevice && (
        <DeviceDetailsDialog
          device={selectedDevice}
          onClose={() => setSelectedDeviceId(null)}
          onRevoke={() => handleRevoke(selectedDevice)}
          revoking={revokingId === selectedDevice.id}
        />
      )}
    </div>
  );
}

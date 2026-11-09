import { AppWindow } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getApps, updateAppCategory, type AppInfo } from "../../api/client";
import { usePageTitle } from "../../utils/usePageTitle";
import { invalidateAll } from "../../utils/requestCache";
import { useAsyncData } from "../../hooks/useAsyncData";
import { AppIcon } from "../../components/ui/AppIcon";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Select } from "../../components/ui/Select";
import { SyncBar } from "../../components/ui/SyncBar";
import { AppsSkeleton } from "../../components/AppsSkeleton";

interface AppsPageData {
  apps: AppInfo[];
  categoryOptions: string[];
}

export function AppUsagePage() {
  usePageTitle("Ilovalar tahlili va toifalar");
  const { token } = useAuth();

  const { data, loading, fetching, error, setData, lastUpdated, reload } = useAsyncData<AppsPageData>(
    async () => {
      const appsRes = await getApps(token!);
      return { apps: appsRes.apps, categoryOptions: appsRes.categoryOptions };
    },
    [token],
    { enabled: !!token, showLoadingOnReload: false, fallbackErrorMessage: "Couldn't load apps.", cacheKey: "apps-goals" }
  );
  const apps = data?.apps ?? [];
  const categoryOptions = data?.categoryOptions ?? [];

  async function handleCategoryChange(appId: string, category: string) {
    if (!token) return;
    setData((prev) => prev && { ...prev, apps: prev.apps.map((a) => (a.id === appId ? { ...a, category: category || null } : a)) });
    try {
      await updateAppCategory(token, appId, category || null);
      invalidateAll();
    } catch {
      reload();
    }
  }

  if (loading) return <AppsSkeleton />;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold m-0 text-ink">Ilovalar Tahlili</h1>
          <p className="text-xs text-muted m-0">Ro'yxatga olingan dasturlar va ularning toifalari</p>
        </div>
        <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      {/* Categorized Apps List */}
      <Panel>
        <PanelHeading icon={AppWindow}>Qayd etilgan ilovalar ({apps.length})</PanelHeading>
        {apps.length === 0 ? (
          <EmptyState>Hozircha ilovalar faolligi qayd etilmagan.</EmptyState>
        ) : (
          <div className="divide-y divide-border">
            {apps.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <AppIcon appId={app.id} identifier={app.identifier} platform={app.platform} size={28} />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-ink truncate">{app.displayName || app.identifier}</div>
                    <div className="text-[11px] text-muted font-mono truncate">{app.identifier}</div>
                  </div>
                </div>

                <div className="shrink-0 w-36">
                  <Select
                    value={app.category || ""}
                    onChange={(e) => handleCategoryChange(app.id, e.target.value)}
                    className="text-xs py-1"
                  >
                    <option value="">Toifasiz</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

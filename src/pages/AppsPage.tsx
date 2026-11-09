import { AppWindow, Plus, Target, Trash2 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { deleteGoal, getApps, getGoals, updateAppCategory, type AppInfo, type Goal } from "../api/client";
import { formatDuration } from "../utils/format";
import { usePageTitle } from "../utils/usePageTitle";
import { invalidateAll } from "../utils/requestCache";
import { useAsyncData } from "../hooks/useAsyncData";
import { useGoalForm } from "../hooks/useGoalForm";
import { AppIcon } from "../components/ui/AppIcon";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Select } from "../components/ui/Select";
import { SyncBar } from "../components/ui/SyncBar";
import { Dialog } from "../components/Dialog";
import { AppsSkeleton } from "../components/AppsSkeleton";

interface AppsPageData {
  apps: AppInfo[];
  categoryOptions: string[];
  goals: Goal[];
}

/** App categorization + daily usage goals — the two things that live together
 * because a goal is always either "one app" or "the whole device". */
export function AppsPage() {
  usePageTitle("Apps & goals");
  const { token } = useAuth();

  const { data, loading, fetching, error, setData, lastUpdated, reload } = useAsyncData<AppsPageData>(
    async () => {
      const [appsRes, goalsRes] = await Promise.all([getApps(token!), getGoals(token!)]);
      return { apps: appsRes.apps, categoryOptions: appsRes.categoryOptions, goals: goalsRes.goals };
    },
    [token],
    { enabled: !!token, showLoadingOnReload: false, fallbackErrorMessage: "Couldn't load apps.", cacheKey: "apps-goals" }
  );
  const apps = data?.apps ?? [];
  const categoryOptions = data?.categoryOptions ?? [];
  const goals = data?.goals ?? [];

  const goalForm = useGoalForm({ token, onSaved: reload });

  async function handleCategoryChange(appId: string, category: string) {
    if (!token) return;
    setData((prev) => prev && { ...prev, apps: prev.apps.map((a) => (a.id === appId ? { ...a, category: category || null } : a)) });
    try {
      await updateAppCategory(token, appId, category || null);
      // This page's own cache entry isn't refetched here (the optimistic update above
      // is trusted) but it — and anything else caching an app's category, e.g. the
      // dashboard — would otherwise still be serving the pre-change value on a later
      // cache-eligible load.
      invalidateAll();
    } catch {
      reload(); // revert to server truth on failure
    }
  }

  async function handleDeleteGoal(id: string) {
    if (!token) return;
    setData((prev) => prev && { ...prev, goals: prev.goals.filter((g) => g.id !== id) });
    try {
      await deleteGoal(token, id);
      invalidateAll(); // see handleCategoryChange's comment — same reasoning
    } catch {
      reload();
    }
  }

  if (loading) return <AppsSkeleton />;

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold m-0">Apps &amp; goals</h1>
        <SyncBar lastUpdated={lastUpdated} syncing={fetching} onSync={reload} />
      </div>

      {error && <p className="text-danger text-sm m-0">{error}</p>}

      <Panel>
        <div className="flex items-center justify-between mb-4">
          <PanelHeading icon={Target} className="mb-0">
            Daily goals
          </PanelHeading>
          <Button onClick={goalForm.openDialog}>
            <Plus size={13} /> Add goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <EmptyState>No goals set — add one to get a heads-up (a native notification from the Windows agent) when you pass a daily limit.</EmptyState>
        ) : (
          goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.actualSeconds / goal.limitSeconds) * 100));
            const over = goal.actualSeconds >= goal.limitSeconds;
            return (
              <div key={goal.id} className="py-3 border-b border-border last:border-b-0">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-sm font-medium flex items-center gap-1.5 min-w-0 truncate">
                    {goal.appId && <AppIcon appId={goal.appId} identifier={goal.appIdentifier} platform={goal.appPlatform} size={14} />}
                    {goal.appDisplayName ?? goal.appIdentifier ?? "Whole device"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs tabular-nums ${over ? "text-danger" : "text-muted"}`}>
                      {formatDuration(goal.actualSeconds)} / {formatDuration(goal.limitSeconds)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="bg-transparent border-none text-muted cursor-pointer p-1 rounded hover:text-danger hover:bg-bg transition-colors flex"
                      aria-label="Delete goal"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ease-out ${over ? "bg-danger" : "bg-accent"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </Panel>

      <Panel>
        <PanelHeading icon={AppWindow}>All apps</PanelHeading>
        {apps.length === 0 ? (
          <EmptyState>No apps tracked yet.</EmptyState>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
              <AppIcon appId={app.id} identifier={app.identifier} platform={app.platform} size={18} />
              <span className="text-sm flex-1 min-w-0 truncate">{app.displayName ?? app.identifier}</span>
              <select
                value={app.category ?? ""}
                onChange={(e) => handleCategoryChange(app.id, e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-surface text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                <option value="">Uncategorized</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </Panel>

      <Dialog open={goalForm.open} onClose={() => goalForm.setOpen(false)} title="Add a daily goal">
        <div className="flex flex-col gap-4">
          <Select label="Applies to" id="goal-app" value={goalForm.appId} onChange={(e) => goalForm.setAppId(e.target.value)}>
            <option value="">Whole device</option>
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.displayName ?? app.identifier}
              </option>
            ))}
          </Select>

          <div className="flex gap-3">
            <Field
              id="goal-hours"
              label="Hours"
              type="number"
              min={0}
              max={24}
              value={goalForm.hours}
              onChange={(e) => goalForm.setHours(e.target.value)}
            />
            <Field
              id="goal-minutes"
              label="Minutes"
              type="number"
              min={0}
              max={59}
              value={goalForm.minutes}
              onChange={(e) => goalForm.setMinutes(e.target.value)}
            />
          </div>

          {goalForm.error && <p className="text-danger text-sm m-0">{goalForm.error}</p>}

          <div className="flex gap-2.5">
            <Button className="flex-1" onClick={goalForm.save} disabled={goalForm.saving}>
              {goalForm.saving ? "Saving…" : "Save goal"}
            </Button>
            <Button className="flex-1" onClick={() => goalForm.setOpen(false)} disabled={goalForm.saving}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Download, LogOut, Monitor, Moon, Pencil, Sun, UserCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useTheme, type ThemePreference } from "../theme/ThemeContext";
import { ApiError, fetchExport } from "../api/client";
import { saveBlob } from "../utils/download";
import { usePageTitle } from "../utils/usePageTitle";
import { useExportRange } from "../hooks/useExportRange";
import { Dialog } from "../components/Dialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Panel } from "../components/ui/Panel";
import { PanelHeading } from "../components/ui/PanelHeading";
import { CollapsiblePanel } from "../components/ui/CollapsiblePanel";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Collapse } from "../components/ui/Collapse";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ProfilePage() {
  usePageTitle("Profile");
  const { user, token, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const exportRange = useExportRange();
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  function startEditing() {
    setNameInput(user?.name ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile(nameInput.trim());
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your name.");
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    if (!token || exportRange.invalid) return;
    setExporting(true);
    setExportError(null);
    try {
      const blob = await fetchExport(token, exportRange.start, exportRange.end, exportFormat);
      saveBlob(blob, `yurak-activity_${exportRange.start}_${exportRange.end}.${exportFormat}`);
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : "Couldn't export your data.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <PanelHeading icon={UserCircle}>Profile</PanelHeading>
          <div className="flex gap-2">
            <Button onClick={startEditing}>
              <Pencil size={13} /> Edit
            </Button>
            <Button className="hover:!border-danger hover:!text-danger" onClick={() => setConfirmingLogout(true)}>
              <LogOut size={13} /> Log out
            </Button>
          </div>
        </div>

        <dl className="m-0">
          <div className="py-2.5 border-b border-border">
            <dt className="text-xs text-muted mb-0.5">Name</dt>
            <dd className="m-0 text-[0.95rem]">{user?.name || <span className="text-muted italic">Not set</span>}</dd>
          </div>
          <div className="py-2.5">
            <dt className="text-xs text-muted mb-0.5">Email</dt>
            <dd className="m-0 text-[0.95rem]">{user?.email}</dd>
          </div>
        </dl>

        {saved && <p className="text-good text-[0.8rem] mt-2.5 m-0 animate-toast-in">Saved.</p>}
      </Panel>

      <Panel>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <PanelHeading icon={Sun} className="mb-0">
            Appearance
          </PanelHeading>
          <SegmentedControl options={THEME_OPTIONS} value={theme} onChange={setTheme} />
        </div>
      </Panel>

      <CollapsiblePanel icon={Download} title="Export data" open={exportOpen} onToggle={() => setExportOpen((o) => !o)}>
          <p className="text-sm text-muted mb-5 mt-3">Download a range of your tracked activity as a file.</p>

          <div className="flex flex-col gap-4">
            <div className="bg-bg border border-border rounded-2xl p-4">
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted mb-3">Range</span>
              <SegmentedControl
                options={[
                  { value: "7" as const, label: "7 days" },
                  { value: "30" as const, label: "30 days" },
                  { value: "90" as const, label: "90 days" },
                  { value: "custom" as const, label: exportRange.customLabel },
                ]}
                value={exportRange.preset}
                onChange={exportRange.setPreset}
              />

              <Collapse open={exportRange.isCustom}>
                <div className="grid grid-cols-2 gap-3 pt-3.5">
                  <Field
                    id="export-start"
                    label="From"
                    type="date"
                    value={exportRange.customStart}
                    max={exportRange.customEnd}
                    onChange={(e) => exportRange.setCustomStart(e.target.value)}
                  />
                  <Field
                    id="export-end"
                    label="To"
                    type="date"
                    value={exportRange.customEnd}
                    max={exportRange.todayStr}
                    onChange={(e) => exportRange.setCustomEnd(e.target.value)}
                  />
                </div>
                {exportRange.invalid && <p className="text-danger text-sm mt-3 mb-0">"From" can't be after "To".</p>}
              </Collapse>
            </div>

            <div className="bg-bg border border-border rounded-2xl p-4">
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted mb-3">Format</span>
              <SegmentedControl
                options={[
                  { value: "csv" as const, label: "CSV" },
                  { value: "json" as const, label: "JSON" },
                ]}
                value={exportFormat}
                onChange={setExportFormat}
              />
            </div>
          </div>

          {exportError && <p className="text-danger text-sm mt-4 mb-0">{exportError}</p>}
          <Button
            variant="primary"
            className="mt-5 text-base py-3.5"
            onClick={handleExport}
            disabled={exporting || exportRange.invalid}
          >
            <Download size={16} /> {exporting ? "Preparing…" : "Download"}
          </Button>
      </CollapsiblePanel>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Edit name">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field
            id="name"
            label="Name"
            type="text"
            placeholder="Add a name"
            maxLength={100}
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          {error && <p className="text-danger text-sm m-0">{error}</p>}

          <div className="flex gap-2.5">
            <Button type="button" className="flex-1" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmingLogout}
        title="Sign out?"
        message="You'll need to log in again to see your dashboard."
        confirmLabel="Sign out"
        danger
        onConfirm={logout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </div>
  );
}

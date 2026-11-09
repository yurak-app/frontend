import { useState, type FormEvent } from "react";
import { Download, LogOut, Monitor, Moon, Pencil, Sun, UserCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTheme, type ThemePreference } from "../../theme/ThemeContext";
import { ApiError, fetchExport } from "../../api/client";
import { saveBlob } from "../../utils/download";
import { usePageTitle } from "../../utils/usePageTitle";
import { useExportRange } from "../../hooks/useExportRange";
import { Dialog } from "../../components/Dialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Panel } from "../../components/ui/Panel";
import { PanelHeading } from "../../components/ui/PanelHeading";
import { CollapsiblePanel } from "../../components/ui/CollapsiblePanel";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { Collapse } from "../../components/ui/Collapse";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "Tizim", icon: Monitor },
  { value: "light", label: "Yorug'", icon: Sun },
  { value: "dark", label: "Qorong'i", icon: Moon },
];

export function SettingsPage() {
  usePageTitle("Sozlamalar va Profil — Yurak");
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
      setError(err instanceof ApiError ? err.message : "Ismni saqlab bo'lmadi.");
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
      saveBlob(blob, `yurak-telemetriya_${exportRange.start}_${exportRange.end}.${exportFormat}`);
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : "Ma'lumotlarni yuklab bo'lmadi.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold m-0 text-ink">Sozlamalar va Profil</h1>
        <p className="text-xs text-muted m-0">Hisob parametrlari, mavzu va telemetriya eksporti</p>
      </div>

      <Panel>
        <div className="flex items-center justify-between mb-4">
          <PanelHeading icon={UserCircle}>Profil</PanelHeading>
          <div className="flex gap-2">
            <Button onClick={startEditing}>
              <Pencil size={13} /> Tahrirlash
            </Button>
            <Button className="hover:!border-danger hover:!text-danger" onClick={() => setConfirmingLogout(true)}>
              <LogOut size={13} /> Chiqish
            </Button>
          </div>
        </div>

        <dl className="m-0">
          <div className="py-2.5 border-b border-border">
            <dt className="text-xs text-muted mb-0.5">Ism</dt>
            <dd className="m-0 text-[0.95rem] text-ink">{user?.name || <span className="text-muted italic">Kiritilmagan</span>}</dd>
          </div>
          <div className="py-2.5">
            <dt className="text-xs text-muted mb-0.5">Elektron pochta</dt>
            <dd className="m-0 text-[0.95rem] text-ink">{user?.email}</dd>
          </div>
        </dl>

        {saved && <p className="text-good text-[0.8rem] mt-2.5 m-0 animate-toast-in">Muvaffaqiyatli saqlandi.</p>}
      </Panel>

      <Panel>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <PanelHeading icon={Sun} className="mb-0">
            Tashqi ko'rinish
          </PanelHeading>
          <SegmentedControl options={THEME_OPTIONS} value={theme} onChange={setTheme} />
        </div>
      </Panel>

      <CollapsiblePanel icon={Download} title="Ma'lumotlarni eksport qilish" open={exportOpen} onToggle={() => setExportOpen((o) => !o)}>
        <p className="text-sm text-muted mb-5 mt-3">
          To'plangan telemetriya ma'lumotlarini (ekran vaqti va tarmoq trafigi) fayl sifatida yuklab oling.
        </p>

        <div className="flex flex-col gap-4">
          <div className="bg-bg border border-border rounded-2xl p-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted mb-3">Vaqt oralig'i</span>
            <SegmentedControl
              options={[
                { value: "7" as const, label: "7 kun" },
                { value: "30" as const, label: "30 kun" },
                { value: "90" as const, label: "90 kun" },
                { value: "custom" as const, label: exportRange.customLabel },
              ]}
              value={exportRange.preset}
              onChange={exportRange.setPreset}
            />

            <Collapse open={exportRange.isCustom}>
              <div className="grid grid-cols-2 gap-3 pt-3.5">
                <Field
                  id="export-start"
                  label="Boshlanish"
                  type="date"
                  value={exportRange.customStart}
                  max={exportRange.customEnd}
                  onChange={(e) => exportRange.setCustomStart(e.target.value)}
                />
                <Field
                  id="export-end"
                  label="Tugash"
                  type="date"
                  value={exportRange.customEnd}
                  max={exportRange.todayStr}
                  onChange={(e) => exportRange.setCustomEnd(e.target.value)}
                />
              </div>
              {exportRange.invalid && <p className="text-danger text-sm mt-3 mb-0">Boshlanish sanasi tugash sanasidan keyin bo'lishi mumkin emas.</p>}
            </Collapse>
          </div>

          <div className="bg-bg border border-border rounded-2xl p-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted mb-3">Fayl formati</span>
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
          <Download size={16} /> {exporting ? "Tayyorlanmoqda…" : "Yuklab olish"}
        </Button>
      </CollapsiblePanel>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Ismni tahrirlash">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field
            id="name"
            label="Ism"
            type="text"
            placeholder="Ismingizni kiriting"
            maxLength={100}
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          {error && <p className="text-danger text-sm m-0">{error}</p>}

          <div className="flex gap-2.5">
            <Button type="button" className="flex-1" onClick={() => setEditing(false)} disabled={saving}>
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saqlanmoqda…" : "Saqlash"}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmingLogout}
        title="Tizimdan chiqilsinmi?"
        message="Boshqaruv panelini ko'rish uchun qaytadan tizimga kirishingiz kerak bo'ladi."
        confirmLabel="Chiqish"
        danger
        onConfirm={logout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </div>
  );
}

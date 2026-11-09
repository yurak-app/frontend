import { useState } from "react";
import { ApiError, createGoal } from "../api/client";
import { invalidateAll } from "../utils/requestCache";

interface UseGoalFormOptions {
  token: string | null;
  onSaved: () => void | Promise<void>;
}

/**
 * The add-goal dialog's form state and submit flow, kept separate from
 * AppsPage's JSX so validation/save reads as a plain sequence of steps
 * instead of being interleaved with markup.
 */
export function useGoalForm({ token, onSaved }: UseGoalFormOptions) {
  const [open, setOpen] = useState(false);
  const [appId, setAppId] = useState("");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setAppId("");
    setHours("2");
    setMinutes("0");
    setError(null);
    setOpen(true);
  }

  async function save() {
    if (!token) return;
    const limitSeconds = (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;
    if (limitSeconds < 60) {
      setError("Set at least 1 minute.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createGoal(token, appId || null, limitSeconds);
      setOpen(false);
      // A new goal also affects anywhere else goals are cached (the dashboard's own
      // combined fetch, notably) — not just this form's own page.
      invalidateAll();
      await onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save that goal.");
    } finally {
      setSaving(false);
    }
  }

  return { open, setOpen, appId, setAppId, hours, setHours, minutes, setMinutes, saving, error, openDialog, save };
}

import { useState } from "react";
import { addDays, formatDateOnly, parseDateOnly, today } from "../utils/dates";

export type ExportPreset = "7" | "30" | "90" | "custom";

const DEFAULT_CUSTOM_DAYS = 30;

/**
 * The date-range side of the export panel: a preset (7/30/90 days) or a
 * custom From/To pair, reduced down to the one `start`/`end` pair the export
 * request actually needs, plus the small bits of derived state the UI reads
 * (the "Custom (9d)" label, whether the range is valid).
 */
export function useExportRange() {
  const todayStr = formatDateOnly(today());
  const [preset, setPreset] = useState<ExportPreset>("30");
  const [customStart, setCustomStart] = useState(formatDateOnly(addDays(today(), -(DEFAULT_CUSTOM_DAYS - 1))));
  const [customEnd, setCustomEnd] = useState(todayStr);

  const isCustom = preset === "custom";
  const start = isCustom ? customStart : formatDateOnly(addDays(today(), -(Number(preset) - 1)));
  const end = isCustom ? customEnd : todayStr;
  const invalid = start > end;

  const customDays =
    customStart <= customEnd
      ? Math.round((parseDateOnly(customEnd).getTime() - parseDateOnly(customStart).getTime()) / 86_400_000) + 1
      : null;
  const customLabel = isCustom && customDays !== null ? `Custom (${customDays}d)` : "Custom";

  return {
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    isCustom,
    start,
    end,
    invalid,
    customLabel,
    todayStr,
  };
}

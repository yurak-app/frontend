import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PanelHeading } from "./PanelHeading";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  hintTone?: "good" | "danger" | "muted";
  /** An icon rendered right before the value — e.g. the actual app icon on a
   * "Top app" tile, standing in for/alongside the generic header glyph. */
  valueIcon?: ReactNode;
}

const HINT_COLOR: Record<NonNullable<StatCardProps["hintTone"]>, string> = {
  good: "text-good",
  danger: "text-danger",
  muted: "text-muted",
};

/** A small KPI tile — the dashboard's top stat row is built from these. */
export function StatCard({ icon, label, value, hint, hintTone = "muted", valueIcon }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl px-4 py-3.5 min-w-0 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)]">
      <PanelHeading icon={icon} className="mb-2">
        {label}
      </PanelHeading>
      <div className="flex items-center gap-1.5 min-w-0">
        {valueIcon}
        {/* Keyed by its own text so a changed value remounts and replays the pop —
            a plain re-render wouldn't retrigger the CSS animation on its own. */}
        <div key={value} className="text-xl font-bold tabular-nums truncate animate-pop">
          {value}
        </div>
      </div>
      {hint && <div className={`text-xs mt-1 truncate ${HINT_COLOR[hintTone]}`}>{hint}</div>}
    </div>
  );
}

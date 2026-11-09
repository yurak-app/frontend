import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PanelHeading } from "./PanelHeading";

/**
 * A panel heading that doubles as a show/hide toggle — pair with `<Collapse>`
 * and `<Panel className="!pt-0">` (the `!` is load-bearing: it's overriding
 * one half of the Panel's own `py-5`, and plain `pt-0` isn't guaranteed to
 * win a same-specificity cascade fight against it). The button is full width
 * and carries its own top padding in place of the Panel's — left/right/bottom
 * still come from the Panel as normal, so the button needs no padding or
 * margin of its own on those sides, and there's no edge-of-panel dead zone
 * left over for a click to land on and do nothing.
 */
export function PanelToggleHeader({
  icon,
  open,
  onToggle,
  children,
}: {
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-2 pt-5 pb-4 bg-transparent border-none cursor-pointer text-left"
      aria-expanded={open}
    >
      <PanelHeading icon={icon} className="mb-0">
        {children}
      </PanelHeading>
      <ChevronDown size={16} className={`text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

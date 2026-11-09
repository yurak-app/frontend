import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "./Panel";
import { PanelToggleHeader } from "./PanelToggleHeader";
import { Collapse } from "./Collapse";

/**
 * A Panel that shows/hides its body behind a full-width header toggle.
 * Bundles the pieces (Panel + PanelToggleHeader + Collapse) plus the one
 * gotcha they need together: the Panel's own bottom padding has to drop out
 * too while collapsed, or the header ends up sitting on top of dead space —
 * the same shape of bug `!pt-0` alone already fixed for the top edge.
 */
export function CollapsiblePanel({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: LucideIcon;
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <Panel className={`!pt-0 ${open ? "" : "!pb-0"}`}>
      <PanelToggleHeader icon={icon} open={open} onToggle={onToggle}>
        {title}
      </PanelToggleHeader>
      <Collapse open={open}>{children}</Collapse>
    </Panel>
  );
}

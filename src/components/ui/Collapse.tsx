import type { ReactNode } from "react";

/**
 * Animates its children open/closed by height, without measuring anything —
 * a `grid-template-rows: 0fr -> 1fr` transition on a single-row grid track,
 * clipped by `overflow-hidden` on the inner wrapper. Used anywhere content
 * needs to reveal/hide in place (a collapsible panel, a conditional form).
 */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

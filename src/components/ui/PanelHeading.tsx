import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** The small uppercase icon+label heading every panel and dialog section uses. */
export function PanelHeading({
  icon: Icon,
  children,
  className = "mb-4",
}: {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted font-semibold ${className}`}>
      <Icon size={13} /> {children}
    </h2>
  );
}

import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="text-muted text-sm text-center py-5 m-0">{children}</p>;
}

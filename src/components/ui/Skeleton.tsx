import type { CSSProperties } from "react";

/** A shimmering placeholder block — width/height passed as inline style since every usage needs a different size. */
export function Skeleton({ style, className = "" }: { style?: CSSProperties; className?: string }) {
  return <span className={`skeleton inline-block animate-shimmer rounded ${className}`} style={style} />;
}

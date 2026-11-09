import { Panel } from "./ui/Panel";
import { Skeleton } from "./ui/Skeleton";
import { AppBarRowSkeleton } from "./AppBarRowSkeleton";
import { BarChartSkeleton } from "./BarChartSkeleton";

// Loading placeholder shaped like the real dashboard content (the sidebar
// itself isn't loading-dependent, so it isn't skeletonized here). Mirrors
// DashboardPage's actual panel order: KPI row, Balance, Top apps, Browser
// activity, Battery history, then the week trend chart — keep this in sync
// when that layout changes, or the loading state stops looking like a preview
// of what's about to render and starts looking like a different page.
function SkeletonHeading({ width, trailing }: { width: number; trailing?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-1.5">
        <Skeleton className="rounded-sm" style={{ width: 13, height: 13 }} />
        <Skeleton style={{ width, height: 11 }} />
      </div>
      {/* Stands in for the Bars/Donut/Share SegmentedControl on panels that have one. */}
      {trailing && <Skeleton className="rounded-full" style={{ width: 128, height: 30 }} />}
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl px-4 py-3.5">
      <div className="flex items-center gap-1.5 mb-2">
        <Skeleton className="rounded-sm" style={{ width: 13, height: 13 }} />
        <Skeleton style={{ width: 44, height: 10 }} />
      </div>
      <Skeleton style={{ width: 60, height: 22 }} />
    </div>
  );
}

/** Thin proportion bar + two bold numbers underneath — the shape of ActiveIdleBalance. */
function SkeletonBalance() {
  return (
    <div>
      <Skeleton className="rounded-full w-full" style={{ height: 12 }} />
      <div className="flex items-center justify-between mt-3.5">
        <Skeleton style={{ width: 56, height: 22 }} />
        <Skeleton style={{ width: 56, height: 22 }} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      <Panel>
        <SkeletonHeading width={64} />
        <SkeletonBalance />
      </Panel>

      <Panel>
        <SkeletonHeading width={78} trailing />
        {[90, 70, 50, 65].map((width, i) => (
          <AppBarRowSkeleton key={i} barWidth={width} />
        ))}
      </Panel>

      <Panel>
        <SkeletonHeading width={110} trailing />
        {[60, 35].map((width, i) => (
          <AppBarRowSkeleton key={i} barWidth={width} />
        ))}
      </Panel>

      <Panel>
        <SkeletonHeading width={100} />
        <Skeleton className="rounded-xl w-full" style={{ height: 170 }} />
      </Panel>

      <Panel>
        <SkeletonHeading width={90} />
        <BarChartSkeleton />
      </Panel>
    </div>
  );
}

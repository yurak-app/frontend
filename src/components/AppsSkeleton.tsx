import { Panel } from "./ui/Panel";
import { Skeleton } from "./ui/Skeleton";

function SkeletonHeading({ width }: { width: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      <Skeleton className="rounded-sm" style={{ width: 13, height: 13 }} />
      <Skeleton style={{ width, height: 11 }} />
    </div>
  );
}

/** Loading placeholder for the apps & goals page — a goal-progress row shape
 * (name, thin bar, count) and an app-list row shape (icon, name, category pill). */
export function AppsSkeleton() {
  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5" aria-busy="true" aria-label="Loading apps">
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <SkeletonHeading width={80} />
          <Skeleton className="rounded-full" style={{ width: 90, height: 28 }} />
        </div>
        {[0, 1, 2].map((i) => (
          <div className="py-3 border-b border-border last:border-b-0" key={i}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <Skeleton style={{ width: 130 }} />
              <Skeleton style={{ width: 70, height: 10 }} />
            </div>
            <Skeleton className="rounded-full w-full" style={{ height: 6 }} />
          </div>
        ))}
      </Panel>

      <Panel>
        <SkeletonHeading width={70} />
        {[0, 1, 2, 3].map((i) => (
          <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0" key={i}>
            <Skeleton className="rounded-md shrink-0" style={{ width: 18, height: 18 }} />
            <Skeleton style={{ width: 140 }} />
            <span className="flex-1" />
            <Skeleton className="rounded-full" style={{ width: 90, height: 24 }} />
          </div>
        ))}
      </Panel>
    </div>
  );
}

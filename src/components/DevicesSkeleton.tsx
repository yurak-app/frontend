import { Panel } from "./ui/Panel";
import { Skeleton } from "./ui/Skeleton";

export function DevicesSkeleton() {
  return (
    <div className="w-full max-w-[720px] flex flex-col gap-5" aria-busy="true" aria-label="Loading devices">
      <Panel>
        <div className="flex items-center gap-1.5 mb-4">
          <Skeleton className="rounded-sm" style={{ width: 13, height: 13 }} />
          <Skeleton style={{ width: 70, height: 11 }} />
        </div>
        {[0, 1, 2].map((i) => (
          <div className="flex items-center gap-3.5 py-3 border-b border-border last:border-b-0" key={i}>
            <Skeleton className="rounded-full shrink-0" style={{ width: 9, height: 9 }} />
            <div className="flex-1 min-w-0">
              <Skeleton style={{ width: 120, marginBottom: 6 }} />
              <Skeleton style={{ width: 90, height: 10 }} />
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

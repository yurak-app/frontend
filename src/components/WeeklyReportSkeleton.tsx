import { Skeleton } from "./ui/Skeleton";

/** Loading placeholder for the "Balance" panel (`ActiveIdleBalance`'s shape) —
 * a proportion bar plus two dot+number rows below it. */
export function BalanceSkeleton() {
  return (
    <div>
      <Skeleton className="rounded-full w-full" style={{ height: 12 }} />
      <div className="flex items-center justify-between mt-3.5">
        <div className="flex items-center gap-2">
          <Skeleton className="rounded-full" style={{ width: 10, height: 10 }} />
          <Skeleton style={{ width: 50, height: 18 }} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton style={{ width: 50, height: 18 }} />
          <Skeleton className="rounded-full" style={{ width: 10, height: 10 }} />
        </div>
      </div>
    </div>
  );
}

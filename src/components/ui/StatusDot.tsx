/** A small status dot — "online" gets a soft radar-ping ring behind it (an
 * actually-live signal, not decoration for its own sake); offline/idle stays a
 * plain static dot so the pulse keeps meaning something when it appears. */
export function StatusDot({ online }: { online: boolean }) {
  return (
    <span className="relative inline-flex w-[9px] h-[9px] shrink-0 align-[-1px]">
      {online && <span className="absolute inset-0 rounded-full bg-good animate-pulse-ring" />}
      <span className={`relative w-[9px] h-[9px] rounded-full ${online ? "bg-good" : "bg-muted"}`} />
    </span>
  );
}

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: LucideIcon;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * A pill-track toggle whose selected option is marked by one sliding thumb
 * (position + width both animate) rather than by restyling each button —
 * the single active-state indicator used for theme, format, and any other
 * small mutually-exclusive choice.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, className = "" }: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<T, HTMLButtonElement>());
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  function measure() {
    const container = containerRef.current;
    const btn = btnRefs.current.get(value);
    if (!container || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    // Rounded to whole pixels: sub-pixel layout jitter (flex-width rounding,
    // a still-settling CSS transition on an ancestor) can make two back-to-back
    // getBoundingClientRect() reads differ by fractions of a pixel with nothing
    // actually having moved — comparing those as "changed" forever re-triggers
    // the effect below, which is an infinite render loop rather than a resync.
    const left = Math.round(btnRect.left - containerRect.left);
    const width = Math.round(btnRect.width);
    setThumb((prev) => (prev && prev.left === left && prev.width === width ? prev : { left, width }));
  }

  // Only re-measures on an actual selection change — NOT on every render — so
  // an unrelated re-render higher up the tree can't re-trigger this. A label
  // growing in place while still selected (e.g. "Custom" -> "Custom (9d)") or
  // a container resize (sidebar collapse, window resize) is instead caught by
  // the ResizeObserver below, which is async and content-driven rather than
  // tied to React's render cycle.
  useLayoutEffect(measure, [value]);

  useEffect(() => {
    const btn = btnRefs.current.get(value);
    const container = containerRef.current;
    if (typeof ResizeObserver === "undefined" || (!btn && !container)) return;
    const observer = new ResizeObserver(measure);
    if (btn) observer.observe(btn);
    if (container) observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div ref={containerRef} className={`relative flex gap-1 p-1 bg-bg border border-border rounded-full ${className}`}>
      {thumb && (
        <div
          className="absolute top-1 bottom-1 rounded-full bg-surface border border-border shadow-sm"
          style={{
            left: thumb.left,
            width: thumb.width,
            transition: "left 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          ref={(el) => {
            if (el) btnRefs.current.set(opt.value, el);
            else btnRefs.current.delete(opt.value);
          }}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            value === opt.value ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {opt.icon && <opt.icon size={14} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

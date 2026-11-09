import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatDateOnly, isDifferentYear, parseDateOnly, today } from "../../utils/dates";

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function buildMonthGrid(monthDate: Date): (string | null)[] {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  // getDay() is 0=Sun..6=Sat; re-based to 0=Mon..6=Sun so the leading blanks
  // line the 1st of the month up under the right Monday-first column.
  const leadingBlanks = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: leadingBlanks }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(formatDateOnly(new Date(monthDate.getFullYear(), monthDate.getMonth(), d)));
  }
  return cells;
}

/**
 * Prev/next-day arrows around a clickable date label — click the label to
 * drop down a small calendar (with its own month navigation and a "Today"
 * shortcut below the grid) instead of jumping one day at a time. Future
 * dates are disabled everywhere: the next-day arrow, and every day cell past
 * today in the calendar.
 */
export function DayNav({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const todayStr = formatDateOnly(today());
  const isToday = value === todayStr;
  const isYesterday = value === formatDateOnly(addDays(today(), -1));

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => parseDateOnly(value));
  const rootRef = useRef<HTMLDivElement>(null);

  // Re-center the calendar on whatever day is current each time it's opened,
  // rather than wherever it was last left scrolled to.
  useEffect(() => {
    if (open) setViewMonth(parseDateOnly(value));
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const valueDate = parseDateOnly(value);
  const label = isToday
    ? "Today"
    : isYesterday
      ? "Yesterday"
      : valueDate.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          ...(isDifferentYear(valueDate) ? { year: "numeric" } : {}),
        });
  const monthLabel = viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const canGoNextMonth = formatDateOnly(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)) <= todayStr;
  const cells = buildMonthGrid(viewMonth);

  function pick(date: string) {
    onChange(date);
    setOpen(false);
  }

  return (
    <div className="relative flex items-center gap-1" ref={rootRef}>
      <button
        type="button"
        className="p-1.5 rounded-full hover:bg-bg hover:text-ink text-muted transition-colors"
        onClick={() => onChange(formatDateOnly(addDays(parseDateOnly(value), -1)))}
        aria-label="Previous day"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        className="w-[132px] py-1 text-sm font-semibold text-center tabular-nums bg-transparent border-none cursor-pointer hover:text-accent transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {label}
      </button>

      <button
        type="button"
        className="p-1.5 rounded-full hover:bg-bg hover:text-ink text-muted transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => onChange(formatDateOnly(addDays(parseDateOnly(value), 1)))}
        disabled={isToday}
        aria-label="Next day"
      >
        <ChevronRight size={16} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-20 bg-surface border border-border rounded-2xl shadow-lg p-3 w-[260px] animate-dialog-in"
          role="dialog"
          aria-label="Pick a date"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="p-1 rounded hover:bg-bg text-muted hover:text-ink transition-colors"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold">{monthLabel}</span>
            <button
              type="button"
              className="p-1 rounded hover:bg-bg text-muted hover:text-ink transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              disabled={!canGoNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-0.5">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={i} className="text-[0.65rem] text-muted text-center py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, i) => {
              if (!cell) return <div key={i} />;
              const isFuture = cell > todayStr;
              const isSelected = cell === value;
              const isCellToday = cell === todayStr;
              return (
                <button
                  key={cell}
                  type="button"
                  disabled={isFuture}
                  onClick={() => pick(cell)}
                  className={`h-7 rounded-lg text-xs tabular-nums transition-colors disabled:opacity-25 disabled:cursor-default ${
                    isSelected
                      ? "bg-accent text-white font-semibold"
                      : isCellToday
                        ? "text-accent font-semibold hover:bg-bg"
                        : "text-ink hover:bg-bg"
                  }`}
                >
                  {parseDateOnly(cell).getDate()}
                </button>
              );
            })}
          </div>

          {!isToday && (
            <div className="mt-3 pt-3 border-t border-border">
              <button
                type="button"
                className="w-full py-1.5 rounded-full text-xs font-semibold border border-border text-muted hover:border-accent hover:text-accent transition-colors"
                onClick={() => pick(todayStr)}
              >
                Today
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

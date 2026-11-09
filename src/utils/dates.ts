// Date-only ("YYYY-MM-DD") helpers, all in the *browser's own local time* — not
// UTC. That match matters: the backend buckets a day by the account's reported
// timezone offset (see backend/src/utils/dates.ts's localDayBounds), which for
// the realistic case (checking the dashboard from the same place the tracked
// device lives) is the same offset this browser is in. Using UTC here used to
// mean "today" on screen could silently mean a different calendar day than the
// one the user was actually living through, depending purely on how far their
// timezone sits from UTC.

export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** Parses a "YYYY-MM-DD" string as a local-time midnight Date (the inverse of formatDateOnly). */
export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Short weekday label ("Mon") for a YYYY-MM-DD date-only string. */
export function weekdayLabel(dateStr: string): string {
  return parseDateOnly(dateStr).toLocaleDateString(undefined, { weekday: "short" });
}

/** Whether `date` falls in a year other than the current one — the signal for
 * whether a short date label ("Mar 9") needs an explicit year suffix to stay
 * unambiguous, rather than always tacking one on. */
export function isDifferentYear(date: Date): boolean {
  return date.getFullYear() !== today().getFullYear();
}

// getDay() is 0=Sun..6=Sat; re-based to 0=Mon..6=Sun so "days since the most
// recent Monday" is a plain lookup instead of a special-cased Sunday.
function daysSinceMonday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** The Monday on or before `date` — matches the backend's week boundary (see stats.service.mostRecentMonday). */
export function mostRecentMonday(date: Date): Date {
  return addDays(date, -daysSinceMonday(date));
}

// Monday-anchored week-of-year, matching the backend's weekNumberOf exactly —
// just a stable, readable "Week 34" label consistent with weeks starting Monday.
export function weekNumberOf(date: Date): number {
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const jan1Monday = mostRecentMonday(jan1);
  const daysSince = Math.round((date.getTime() - jan1Monday.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(daysSince / 7) + 1;
}

/**
 * "December 15 – 21" (same month, this year), "September 29 – October 5"
 * (spanning months, this year), "December 15 – 21, 2025" (same month, a
 * different year), or "December 30, 2024 – January 5, 2025" (crossing a
 * year boundary — both ends spelled out fully, year included on both since
 * it's clearly load-bearing there).
 *
 * The year is appended as its own `, 2025` after the whole range, never
 * folded into one end's own `toLocaleDateString` options — asking Intl for
 * day+year with no month is a combination it doesn't have a defined pattern
 * for, and at least one real engine responds by silently dropping the day
 * instead of just reordering it.
 */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = parseDateOnly(weekStart);
  const end = parseDateOnly(weekEnd);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (!sameYear) {
    const full: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString(undefined, full)} – ${end.toLocaleDateString(undefined, full)}`;
  }

  const startLabel = start.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  const endLabel = sameMonth
    ? end.toLocaleDateString(undefined, { day: "numeric" })
    : end.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  const range = `${startLabel} – ${endLabel}`;
  return isDifferentYear(start) ? `${range}, ${end.getFullYear()}` : range;
}

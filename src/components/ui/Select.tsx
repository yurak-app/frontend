import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id?: string;
}

/** A labeled select — same visual language as Field, for the handful of dropdowns in the app. */
export function Select({ label, id, className = "", children, ...selectProps }: SelectProps) {
  const select = (
    <select
      id={id}
      className="w-full px-4 py-3 rounded-2xl border border-border bg-surface text-ink text-[0.95rem] transition-colors focus:outline-2 focus:outline-accent focus:-outline-offset-1 focus:border-accent"
      {...selectProps}
    >
      {children}
    </select>
  );

  if (!label) return <div className={className}>{select}</div>;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm mb-1.5 text-muted">
        {label}
      </label>
      {select}
    </div>
  );
}

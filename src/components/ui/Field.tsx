import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

/** A labeled text input — the one input style for the whole site. */
export function Field({ label, id, className = "", ...inputProps }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm mb-1.5 text-muted">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-3 rounded-2xl border border-border bg-transparent text-ink text-[0.95rem] transition-colors focus:outline-2 focus:outline-accent focus:-outline-offset-1 focus:border-accent"
        {...inputProps}
      />
    </div>
  );
}

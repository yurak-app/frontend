import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-default";

const variantClasses: Record<Variant, string> = {
  primary: "w-full py-3 rounded-full bg-accent text-white text-[0.95rem] font-semibold hover:bg-accent-hover",
  secondary: "px-3.5 py-2 rounded-full border border-border bg-transparent text-ink text-[0.82rem] hover:border-accent hover:text-accent",
  danger: "px-3.5 py-2 rounded-full border border-danger bg-transparent text-danger text-[0.82rem] hover:bg-danger hover:text-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** The one button component for the whole site — pick a variant instead of hand-styling. */
export function Button({ variant = "secondary", type = "button", className = "", ...props }: ButtonProps) {
  return <button type={type} className={`${base} ${variantClasses[variant]} ${className}`} {...props} />;
}

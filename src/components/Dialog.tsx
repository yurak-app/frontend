import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** "default" (440px, most dialogs) or "lg" (grows further on wide viewports —
   * content-heavy dialogs like device details, which would otherwise waste all
   * the extra room a big screen has to give). */
  size?: "default" | "lg";
}

// Matches the `dialog-out`/`overlay-out` animation durations in tailwind.css —
// the dialog stays mounted for this long after `open` goes false so it can
// actually play the exit animation instead of just vanishing.
const EXIT_ANIMATION_MS = 140;

const SIZE_CLASSES: Record<NonNullable<DialogProps["size"]>, string> = {
  default: "max-w-[440px] max-h-[min(600px,85vh)]",
  lg: "max-w-[440px] sm:max-w-[560px] lg:max-w-[720px] max-h-[min(760px,85vh)]",
};

/**
 * Modal shell every dialog in the app is built on: animates in on open and
 * out on close (rather than the old instant mount/unmount), keeps its header
 * pinned while only the body scrolls, and closes on Escape or a backdrop click.
 */
export function Dialog({ open, onClose, title, subtitle, children, size = "default" }: DialogProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
    // Only `open` should drive this — `mounted` is read, not depended on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  // Locks the page behind the modal — without this, the backdrop just sits on
  // top while the real page underneath still scrolls with it (mouse wheel,
  // touch, arrow keys), which reads as broken since the modal itself visually
  // implies it's the only thing you can interact with right now.
  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  // Portaled straight to <body> — mounting this in place would otherwise trap it
  // inside whatever ancestor happens to establish a stacking context (e.g. the
  // sidebar's `sticky` nav always does, by spec), which confines this `fixed`
  // overlay's z-index to *within* that ancestor instead of the whole page —
  // letting later, unrelated DOM siblings paint over a "modal" that's still
  // visually on top of its own parent. A portal sidesteps that entirely.
  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-100 ${
        closing ? "animate-overlay-out" : "animate-overlay-in"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full ${SIZE_CLASSES[size]} flex flex-col bg-surface border border-border rounded-[28px] overflow-hidden transition-[max-width] duration-200 ${
          closing ? "animate-dialog-out" : "animate-dialog-in"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
          <div className="min-w-0">
            <h3 className="m-0 text-lg font-semibold truncate">{title}</h3>
            {subtitle && <p className="m-0 mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="bg-transparent border-none text-muted cursor-pointer p-1 rounded-md flex shrink-0 hover:text-ink hover:bg-bg transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 pb-6 flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

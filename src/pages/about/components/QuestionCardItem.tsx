import { CheckCircle2, type LucideIcon } from "lucide-react";

export interface QuestionCardData {
  number: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  summary: string;
  details: string[];
}

export function QuestionCardItem({
  item,
  className = "",
}: {
  item: QuestionCardData;
  className?: string;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-7 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-all shadow-xs select-none ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-11 h-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon size={22} />
          </div>
          <span
            className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
          >
            {item.badge}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-xl font-bold text-ink leading-snug">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {item.summary}
          </p>
        </div>

        <ul className="pt-2 border-t border-border space-y-2 text-xs text-muted">
          {item.details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


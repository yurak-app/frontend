import { LucideIcon } from "lucide-react";

export interface FeatureData {
  icon: LucideIcon;
  tag: string;
  tagColor: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

interface FeatureCardProps {
  item: FeatureData;
  className?: string;
}

export function FeatureCard({ item, className = "" }: FeatureCardProps) {
  const Icon = item.icon;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-bg border border-border hover:border-accent/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 select-none ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shadow-xs shrink-0`}
          >
            <Icon size={20} />
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border shrink-0 ${item.tagColor}`}
          >
            {item.tag}
          </span>
        </div>

        <div>
          <h3 className="font-bold text-sm sm:text-base text-ink mb-1.5 leading-snug">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50 text-[10px] sm:text-[11px] text-muted font-mono flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" />
        <span>Avtomatik rejim</span>
      </div>
    </div>
  );
}


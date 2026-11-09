import { usePageTitle } from "../../utils/usePageTitle";
import { ClientPlatformCard, type PlatformKind } from "../../components/ClientPlatformCard";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const PLATFORMS: PlatformKind[] = ["android", "windows", "extension"];

export function DownloadPage() {
  usePageTitle(
    "Ilovalarni yuklab olish — Yurak",
    "Yurak Android APK, Windows EXE agenti va Chrome brauzer kengaytmasini rasmiy GitHub repozitoriyasidan yuklab oling."
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Yuklab Olish Markazi
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Yurak agentlari va mijoz dasturlari
        </h1>
        <p className="text-xs sm:text-base text-muted leading-relaxed">
          Barcha dasturlar ochiq manbali va rasmiy GitHub repozitoriyalaridagi Latest Release bo'limidan to'g'ridan-to'g'ri yuklab olinadi.
        </p>
      </div>

      {/* 1. Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
        {PLATFORMS.map((kind) => (
          <ClientPlatformCard key={kind} kind={kind} />
        ))}
      </div>

      {/* 2. Mobile Continuous Reverse Auto-Scroll Carousel (Chapdan O'ngga) */}
      <div className="block md:hidden -mx-4 overflow-hidden relative">
        <div className="flex w-max gap-4 px-4 animate-loop-scroll-reverse">
          {PLATFORMS.map((kind) => (
            <ClientPlatformCard
              key={`dl1-${kind}`}
              kind={kind}
              className="w-[78vw] max-w-[285px] shrink-0"
            />
          ))}
          {PLATFORMS.map((kind) => (
            <ClientPlatformCard
              key={`dl2-${kind}`}
              kind={kind}
              className="w-[78vw] max-w-[285px] shrink-0"
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-muted pt-3 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          <span>O'qish uchun bosing yoki teging (avtomatik aylanadi)</span>
        </p>
      </div>

      {/* Quick Guide Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="font-bold text-base sm:text-lg text-ink">
            O'rnatishda yordam kerakmi?
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Android, Windows va Brauzer kengaytmasini to'g'ri ulash bo'yicha bosqichma-bosqich qo'llanmani o'qing.
          </p>
        </div>

        <Link
          to="/docs"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent-hover transition-colors shadow-sm shrink-0"
        >
          <BookOpen size={15} />
          Qo'llanmani ochish →
        </Link>
      </div>
    </div>
  );
}

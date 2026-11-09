import { ClientPlatformCard, type PlatformKind } from "../../../components/ClientPlatformCard";

const PLATFORMS: PlatformKind[] = ["android", "windows", "extension"];

export function PlatformsSection() {
  return (
    <section id="platforms" className="py-20 bg-bg border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
            Kross-Platformali Mijozlar
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Barcha qurilmalaringiz uchun rasmiy mijozlar
          </h2>
          <p className="text-muted text-xs sm:text-base leading-relaxed">
            Telefon, shaxsiy kompyuter va brauzeringizni bitta hisobga ulang. Har bir platforma fon rejimida minimal quvvat bilan ishlaydi.
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
            {/* First set */}
            {PLATFORMS.map((kind) => (
              <ClientPlatformCard
                key={`p1-${kind}`}
                kind={kind}
                className="w-[78vw] max-w-[285px] shrink-0"
              />
            ))}
            {/* Duplicated set for seamless loop */}
            {PLATFORMS.map((kind) => (
              <ClientPlatformCard
                key={`p2-${kind}`}
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
      </div>
    </section>
  );
}

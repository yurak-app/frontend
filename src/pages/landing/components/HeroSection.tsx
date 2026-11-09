import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Download, Laptop, Radio, Smartphone, Timer } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border bg-gradient-to-b from-surface to-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Yurak v1.0 · Kross-Platform Telemetriya
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-[1.15]">
              Faollik va tarmoq trafigini <span className="text-accent">aniq o'lchash</span> tizimi.
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Android, Windows va veb-brauzerlar uchun markazlashgan telemetriya platformasi. Operatsion tizim darajasidagi aniq ekran vaqti, ilovalar faolligi va tarmoq sarfi (Mobil, Wi-Fi, Hotspot) hisoboti.
            </p>

            {/* Quick Spec List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-ink">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent shrink-0" />
                <span>OS darajasidagi 1:1 aniqlik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent shrink-0" />
                <span>Mobil, Wi-Fi va Hotspot ajratmasi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent shrink-0" />
                <span>Hech qanday reklama yoki trekersiz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent shrink-0" />
                <span>Oflayn rejim va xavfsiz sinxronlash</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-md shadow-accent/20"
              >
                <Download size={18} />
                Ilovalarni yuklab olish
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-bg text-ink font-semibold text-sm transition-all"
              >
                Hisob ochish
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border text-sm font-medium transition-all"
              >
                Qo'llanma
              </Link>
            </div>
          </div>

          {/* Right Column: Live Telemetry Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-surface shadow-xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                    Y
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-ink leading-tight">Xiaomi Redmi Note 8 Pro</h3>
                    <p className="text-[11px] text-muted font-mono">Toshkent (UTC+5) · Sinxronlangan</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Faol
                </span>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-bg border border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Timer size={14} className="text-accent" />
                    <span>Ekran vaqti</span>
                  </div>
                  <div className="text-xl font-bold text-ink">5s 46d</div>
                  <p className="text-[11px] text-muted">Bugungi sof faollik</p>
                </div>

                <div className="p-3 rounded-xl bg-bg border border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Radio size={14} className="text-sky-500" />
                    <span>Jami trafik</span>
                  </div>
                  <div className="text-xl font-bold text-ink">6.79 GB</div>
                  <p className="text-[11px] text-muted">Mobil: 4.54G · Hotspot: 2.26G</p>
                </div>
              </div>

              {/* Top Apps sample */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider">Top ilovalar telemetriyasi</div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <span className="font-medium text-ink">Instagram</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-muted">
                      <span>1s 58d</span>
                      <span>535 MB</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span className="font-medium text-ink">PUBG</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-muted">
                      <span>1s 36d</span>
                      <span>583 MB</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="font-medium text-ink">Telegram</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-muted">
                      <span>28 daqiqa</span>
                      <span>388 MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Platforms Tag */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1.5"><Smartphone size={13} /> Android</span>
                <span className="flex items-center gap-1.5"><Laptop size={13} /> Windows</span>
                <span className="flex items-center gap-1.5">Web Extension</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

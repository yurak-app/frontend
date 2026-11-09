import { usePageTitle } from "../../utils/usePageTitle";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { PlatformsSection } from "./components/PlatformsSection";
import { Link } from "react-router-dom";
import { Code, Database, Server, Shield } from "lucide-react";

export function LandingPage() {
  usePageTitle("Yurak — Faollik va Tarmoq Telemetriyasi");

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Technical Features */}
      <FeaturesSection />

      {/* 3. Platform Agents */}
      <PlatformsSection />

      {/* 4. Architecture & Security Section */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-border text-xs font-mono text-muted">
                Tizim Arxitekturasi
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Xavfsiz, ochiq va kengaytiriluvchi telemetriya protokoli
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Yurak mijozi (agent) va markaziy backend o'rtasidagi ma'lumot almashinuvi shifrlangan HTTPS protokoli orqali amalga oshiriladi. Har bir qurilma o'zining unikal API tokeniga ega.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-bg border border-border">
                  <Server size={18} className="text-accent mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-ink block">REST Ingestion API</span>
                    <span className="text-muted">Hodisalar 50 tadan paketlarda idempotent tarzda qabul qilinadi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-bg border border-border">
                  <Database size={18} className="text-sky-500 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-ink block">PostgreSQL & Prisma Rollups</span>
                    <span className="text-muted">Kunlik va haftalik jadvallar avtomatik birlashtirilib tezkor hisoblanadi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-bg border border-border">
                  <Shield size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-ink block">Shaxsiy Ma'lumotlar Daxlsizligi</span>
                    <span className="text-muted">Faqat vaqt va tarmoq drayveri hisoblari saqlanadi, shaxsiy kontent olinmaydi.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code / Protocol snippet visual */}
            <div className="rounded-2xl border border-border bg-ink text-surface p-6 font-mono text-xs overflow-x-auto shadow-xl">
              <div className="flex items-center justify-between border-b border-surface/20 pb-3 mb-4 text-surface/60">
                <span className="flex items-center gap-2"><Code size={14} /> Telemetriya JSON Namuna</span>
                <span>POST /api/v1/events</span>
              </div>
              <pre className="text-emerald-400 leading-relaxed">
{`{
  "events": [
    {
      "eventType": "app_usage",
      "appIdentifier": "org.telegram.messenger",
      "appDisplayName": "Telegram",
      "startedAt": "2026-11-09T08:00:00.000Z",
      "endedAt": "2026-11-09T08:28:30.000Z",
      "durationSeconds": 1710,
      "cellularBytes": 4073324544,
      "wifiBytes": 0,
      "sessionStart": true
    }
  ]
}`}
              </pre>
              <div className="mt-4 pt-3 border-t border-surface/20 flex items-center justify-between text-[11px] text-surface/60">
                <span>Dedup key: [deviceId, appId, eventType, startedAt, endedAt]</span>
                <span className="text-emerald-300">HTTP 201 Created</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-bg text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            O'z qurilmalaringizni monitoring qilishga tayyormisiz?
          </h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            Android APK'ni yuklab oling yoki veb-kabinet orqali yangi hisob yaratib darhol boshlang.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/download"
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm"
            >
              Ilovalarni yuklab olish
            </Link>
            <Link
              to="/docs"
              className="px-5 py-3 rounded-xl border border-border bg-surface hover:bg-bg text-ink font-semibold text-sm transition-colors"
            >
              Qo'llanmani o'qish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Activity, Clock, Cpu, Database, ShieldCheck, Wifi } from "lucide-react";
import { FeatureCard, type FeatureData } from "./FeatureCard";

const FEATURES: FeatureData[] = [
  {
    icon: Clock,
    tag: "OS DARAJASIDA",
    tagColor: "text-accent bg-accent/10 border-accent/20",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "1:1 Ekran Vaqti Aniqligi",
    description:
      "Faqat ekran ochiq va ilova faol bo'lgan daqiqalar hisoblanadi. Fon audio yoki yopiq ekran vaqti aralashmaydi.",
  },
  {
    icon: Wifi,
    tag: "TARMOQ DRAYVERI",
    tagColor: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    title: "Tarmoq Sarfi Telemetriyasi",
    description:
      "Mobil internet (SIM), Wi-Fi va Hotspot (tethering) orqali tarqatilgan trafigi alohida baytlar kesimida jamlanadi.",
  },
  {
    icon: Cpu,
    tag: "YAGONA EKOTIZIM",
    tagColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    title: "Kross-Platform Arxitektura",
    description:
      "Android telefoni, Windows kompyuteri va brauzeringiz bitta hisob ostida birlashib, umumiy faollikni ko'rsatadi.",
  },
  {
    icon: Database,
    tag: "ZERO DATA LOSS",
    tagColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    title: "Oflayn Buferlash Tizimi",
    description:
      "Internet uzilganda hodisalar lokal SQLite bazasida xavfsiz saqlanadi. Aloqa tiklangach to'liq serverga uzatiladi.",
  },
  {
    icon: Activity,
    tag: "TOSHKENT UTC+5",
    tagColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    title: "Vaqt Mintaqasi Hisobi",
    description:
      "Barcha telemetriya Toshkent vaqti bilan qat'iy 00:00:00 dan 23:59:59 gacha bo'lgan kunlik chegaralarga bog'lanadi.",
  },
  {
    icon: ShieldCheck,
    tag: "100% DAXLSIZLIK",
    tagColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    title: "Formal Maxfiylik Kafolati",
    description:
      "Klaviatura matnlari, parollar, xabarlar yoki fayllar kuzatilmaydi. Faqat ochiq OS darajasidagi raqamlar saqlanadi.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-surface border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-border text-xs font-mono text-muted">
            Texnik Xususiyatlar
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Aniq, barqaror va ortiqcha shovqinsiz telemetriya
          </h2>
          <p className="text-muted text-xs sm:text-base leading-relaxed">
            Yurak murakkab hisob-kitoblarni operatsion tizimning rasmiy API vositalari orqali xolis va xatosiz amalga oshiradi.
          </p>
        </div>

        {/* 1. Desktop Grid (md and up) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => (
            <FeatureCard key={idx} item={item} />
          ))}
        </div>

        {/* 2. Mobile Continuous Looping Auto-Scroll Carousel */}
        <div className="block md:hidden -mx-4 overflow-hidden relative">
          <div className="flex w-max gap-4 px-4 animate-loop-scroll">
            {/* First set of features */}
            {FEATURES.map((item, idx) => (
              <FeatureCard
                key={`f1-${idx}`}
                item={item}
                className="w-[78vw] max-w-[280px] shrink-0"
              />
            ))}
            {/* Duplicated set for seamless, glitch-free continuous loop */}
            {FEATURES.map((item, idx) => (
              <FeatureCard
                key={`f2-${idx}`}
                item={item}
                className="w-[78vw] max-w-[280px] shrink-0"
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-muted pt-3 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>O'qish uchun bosing yoki teging (avtomatik aylanadi)</span>
          </p>
        </div>
      </div>
    </section>
  );
}

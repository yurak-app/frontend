import { Download, ExternalLink, Laptop, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { GithubIcon } from "../../../components/ui/GithubIcon";

export function PlatformsSection() {
  return (
    <section className="py-20 bg-bg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
            Mijoz Dasturlari (Clients)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Har bir platforma uchun moslashtirilgan agentlar
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Qurilmangiz turiga qarab rasmiy agentni o'rnating va barcha ma'lumotlarni yagona hisobingiz orqali tahlil qiling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Android */}
          <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-accent font-semibold tracking-wider uppercase">Rasmiy Mijoz</span>
                <h3 className="text-xl font-bold text-ink">Android Client</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Android 9.0 (API 28) va undan yuqori qurilmalar uchun mahalliy Kotlin ilovasi. WorkManager orqali fon rejimida batareyani tejab ishlaydi.
              </p>
              <ul className="text-xs text-ink space-y-2 pt-2 border-t border-border">
                <li className="flex items-center gap-2">✓ UsageStatsManager (1:1 aniqlik)</li>
                <li className="flex items-center gap-2">✓ Mobil & Hotspot tarmoq hisobi</li>
                <li className="flex items-center gap-2">✓ Lokal SQLite oflayn navbat</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <a
                href="https://github.com/yurak-app/android/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
              >
                <Download size={16} />
                Android APK (.apk)
              </a>
              <a
                href="https://github.com/yurak-app/android"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink text-xs font-medium transition-colors"
              >
                <GithubIcon size={14} /> Manba kodi (GitHub)
              </a>
            </div>
          </div>

          {/* 2. Windows */}
          <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Laptop size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-sky-600 font-semibold tracking-wider uppercase">Kompyuter Agenti</span>
                <h3 className="text-xl font-bold text-ink">Windows Agent</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Windows 10 va 11 uchun .NET / Win32 agenti. Tizim treyida sokin ishlaydi, aktiv oyna sarlavhalari va ish vaqtini qayd etadi.
              </p>
              <ul className="text-xs text-ink space-y-2 pt-2 border-t border-border">
                <li className="flex items-center gap-2">✓ ForegroundWindowTracker</li>
                <li className="flex items-center gap-2">✓ Kam resurs sarfi (&lt; 25 MB RAM)</li>
                <li className="flex items-center gap-2">✓ Avtomatik fon sinxronizatsiyasi</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <a
                href="https://github.com/yurak-app/windows/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:bg-surface text-ink font-semibold text-sm transition-colors"
              >
                <Download size={16} />
                Windows (.exe)
              </a>
              <a
                href="https://github.com/yurak-app/windows"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink text-xs font-medium transition-colors"
              >
                <GithubIcon size={14} /> Manba kodi (GitHub)
              </a>
            </div>
          </div>

          {/* 3. Extension */}
          <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Globe size={24} />
              </div>
              <div>
                <span className="text-xs font-mono text-purple-600 font-semibold tracking-wider uppercase">Brauzer Kengaytmasi</span>
                <h3 className="text-xl font-bold text-ink">Web Extension</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Chrome, Edge va Chromium brauzerlar uchun Manifest V3 kengaytmasi. Tablar o'rtasida sarflangan sof vaqtni o'lchaydi.
              </p>
              <ul className="text-xs text-ink space-y-2 pt-2 border-t border-border">
                <li className="flex items-center gap-2">✓ Domenlar bo'yicha aniq hisob</li>
                <li className="flex items-center gap-2">✓ Sayt ichki kontentini o'qimaydi</li>
                <li className="flex items-center gap-2">✓ Manifest V3 xavfsiz standarti</li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <a
                href="https://github.com/yurak-app/extension"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:bg-surface text-ink font-semibold text-sm transition-colors"
              >
                <ExternalLink size={16} />
                Extension Shablon (GitHub)
              </a>
              <Link
                to="/docs#extension"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink text-xs font-medium transition-colors"
              >
                O'rnatish qo'llanmasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { usePageTitle } from "../../utils/usePageTitle";
import { Download, ExternalLink, Laptop, Smartphone, Globe, AlertCircle } from "lucide-react";
import { GithubIcon } from "../../components/ui/GithubIcon";

export function DownloadPage() {
  usePageTitle("Ilovalarni yuklab olish — Yurak");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Yuklab Olish Markazi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Yurak agentlari va mijoz dasturlari
        </h1>
        <p className="text-base text-muted leading-relaxed">
          Barcha dasturlar ochiq manbali va rasmiy GitHub repozitoriyalaridagi Latest Release bo'limidan to'g'ridan-to'g'ri yuklab olinadi.
        </p>
      </div>

      {/* Download Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Android */}
        <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <div>
              <div className="text-xs font-mono text-accent font-semibold uppercase">Mobil Ilova</div>
              <h2 className="text-xl font-bold text-ink">Yurak Android</h2>
              <span className="text-xs text-muted font-mono">v1.0.0 · APK Fayl</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Android qurilmalar uchun rasmiy telemetriya agenti. UsageEvents va NetworkStatsManager orqali tizim darajasidagi aniq ekran vaqti va tarmoq trafigini hisoblaydi.
            </p>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted">
              <div><strong>Talab:</strong> Android 9.0+ (API 28+)</div>
              <div><strong>Hajmi:</strong> ~12 MB</div>
              <div><strong>Arxitektura:</strong> arm64-v8a, armeabi-v7a, x86_64</div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="https://github.com/yurak-app/android/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Download size={16} />
              Android APK Yuklab Olish
            </a>
            <a
              href="https://github.com/yurak-app/android"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink text-xs font-medium transition-colors"
            >
              <GithubIcon size={14} /> GitHub Repozitoriy
            </a>
          </div>
        </div>

        {/* 2. Windows */}
        <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Laptop size={24} />
            </div>
            <div>
              <div className="text-xs font-mono text-sky-600 font-semibold uppercase">Desktop Agent</div>
              <h2 className="text-xl font-bold text-ink">Yurak Windows</h2>
              <span className="text-xs text-muted font-mono">v1.0.0 · EXE Installer</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Windows kompyuterlari uchun fon agenti. Tizim treyida engil ishlaydi, aktiv oynalar va dasturlar sarflagan daqiqalarni qayd etadi.
            </p>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted">
              <div><strong>Talab:</strong> Windows 10 / 11 (64-bit)</div>
              <div><strong>Muhit:</strong> .NET 8.0 Desktop Runtime</div>
              <div><strong>Hajmi:</strong> ~8 MB</div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="https://github.com/yurak-app/windows/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:bg-surface text-ink font-semibold text-sm transition-colors"
            >
              <Download size={16} />
              Windows EXE Yuklab Olish
            </a>
            <a
              href="https://github.com/yurak-app/windows"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink text-xs font-medium transition-colors"
            >
              <GithubIcon size={14} /> GitHub Repozitoriy
            </a>
          </div>
        </div>

        {/* 3. Extension */}
        <div className="rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <div className="text-xs font-mono text-purple-600 font-semibold uppercase">Brauzer Moduli</div>
              <h2 className="text-xl font-bold text-ink">Chrome Extension</h2>
              <span className="text-xs text-muted font-mono">Manifest V3 · ZIP / Source</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Chromium asosidagi brauzerlar (Google Chrome, MS Edge, Brave) uchun kengaytma shabloni. Domenlar bo'yicha aniq sarflangan vaqtni hisoblaydi.
            </p>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted">
              <div><strong>Talab:</strong> Chromium 100+</div>
              <div><strong>Ruxsat:</strong> tabs, storage, alarms</div>
              <div><strong>Standart:</strong> Manifest V3</div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href="https://github.com/yurak-app/extension"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:bg-surface text-ink font-semibold text-sm transition-colors"
            >
              <ExternalLink size={16} />
              Extension Repozitoriy (ZIP)
            </a>
            <div className="text-center text-[11px] text-muted">
              Developer mode orqali o'rnatish
            </div>
          </div>
        </div>
      </div>

      {/* Installation Instruction Section */}
      <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
        <h3 className="text-lg font-bold text-ink">Android ilovani o'rnatish tartibi:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-semibold text-ink">APK faylni yuklab oling</h4>
            <p className="text-muted text-xs leading-relaxed">
              Yuqoridagi tugma orqali eng so'nggi <code>app-debug.apk</code> yoki rasmiy release faylini telefoningizga yuklang.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-semibold text-ink">Usage Access ruxsatini bering</h4>
            <p className="text-muted text-xs leading-relaxed">
              Ilovani ochgach, ekranda chiqadigan ko'rsatma orqali <em>"Usage Access" (Ilovalardan foydalanish ma'lumotlari)</em> ruxsatini yoqing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-semibold text-ink">Hisobingizga kiring</h4>
            <p className="text-muted text-xs leading-relaxed">
              Vebsaytda ro'yxatdan o'tgan email va parolingiz bilan ilovaga kiring. Qurilma avtomatik ulanadi va hisob-kitob boshlanadi.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3 text-xs text-muted">
          <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
          <span>
            <strong>Xavfsizlik eslatmasi:</strong> APK faylini birinchi marta o'rnatayotganda Android tizimi "Noma'lum manbalardan o'rnatish"ga ruxsat so'rashi mumkin. Loyiha 100% ochiq manbali bo'lib, har bir qator kod GitHub'da ochiq tekshirish uchun mavjud.
          </span>
        </div>
      </div>
    </div>
  );
}

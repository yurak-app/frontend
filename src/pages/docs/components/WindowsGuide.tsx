import { Download, Laptop, Monitor } from "lucide-react";

export function WindowsGuide() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-8 animate-fade-in-up">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <Laptop size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Windows Agentini O'rnatish</h2>
            <p className="text-xs text-muted">Windows 10 va Windows 11 (64-bit) uchun</p>
          </div>
        </div>

        <a
          href="https://github.com/yurak-app/windows/releases/latest"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-xs sm:text-sm hover:bg-sky-600 transition-colors shadow-sm shrink-0"
        >
          <Download size={15} />
          EXE Yuklab Olish
        </a>
      </div>

      {/* Overview Note */}
      <div className="p-4 rounded-xl bg-bg border border-border text-xs sm:text-sm text-muted leading-relaxed">
        Windows agenti kompyuterda ishlayotganingizda aktiv dasturlar (VS Code, Excel, Telegram va h.k.) va
        oynalar sarflagan vaqtni fon rejimida hisoblab boradi. Kompyuterni tark etganingizda esa tanaffusni (idle) aniqlaydi.
      </div>

      {/* Step by Step list */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-mono shrink-0">
              1
            </span>
            O'rnatish paketini ishga tushiring
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Yuklab olingan <code>YurakSetup.exe</code> faylini ikki marta bosing va standart o'rnatish jarayonini yakunlang. Dastur kompyuter resurslarini deyarli sarflamaydi (&lt; 25 MB RAM).
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-mono shrink-0">
              2
            </span>
            Tizim treyida (System Tray) hisobni bog'lang
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Dastur ishga tushgach, ekraningizning pastki o'ng burchagidagi soat yonida Yurak piktogrammasi paydo bo'ladi. Uni bosing va elektron pochta hamda parolingiz bilan kiring.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-mono shrink-0">
              3
            </span>
            Avtomatik ishga tushishni (Startup) tekshiring
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Dastur sozlamalarida "Start with Windows" funksiyasi yoqilganligiga ishonch hosil qiling. Shunda har safar kompyuter yoqilganda telemetriya avtomatik davom etadi.
          </p>
        </div>
      </div>

      {/* Assurance Card */}
      <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-3 text-xs sm:text-sm">
        <Monitor size={20} className="text-sky-500 shrink-0 mt-0.5" />
        <div className="text-ink">
          <strong>Oyna sarlavhalari maxfiyligi:</strong> Agent faqat faol jarayon nomi va asosiy dastur nomini qayd etadi. Ekran tasvirlari (screenshot) yoki klaviatura tugmalari mutlaqo yozib olinmaydi.
        </div>
      </div>
    </div>
  );
}

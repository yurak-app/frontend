import { Download, ShieldCheck, Smartphone } from "lucide-react";

export function AndroidGuide() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-8 animate-fade-in-up">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Smartphone size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Android Ilovasini Sozlash</h2>
            <p className="text-xs text-muted">Android 9.0 (Pie) va undan yuqori barcha smartfonlar uchun</p>
          </div>
        </div>

        <a
          href="https://github.com/yurak-app/android/releases/latest"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent-hover transition-colors shadow-sm shrink-0"
        >
          <Download size={15} />
          APK Yuklab Olish
        </a>
      </div>

      {/* Overview Note */}
      <div className="p-4 rounded-xl bg-bg border border-border text-xs sm:text-sm text-muted leading-relaxed">
        Yurak ilovasi ekran vaqti va tarmoq trafigini to'g'ri hisoblashi uchun Android operatsion tizimining
        ichki drayverlaridan foydalanadi. Buning uchun 2 ta xavfsiz tizim ruxsatnomasi talab qilinadi.
      </div>

      {/* Step by Step list */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-mono shrink-0">
              1
            </span>
            APK faylini o'rnating
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Telefoningizda yuklab olingan <code>.apk</code> faylini oching. Agar brauzeringiz
            "Noma'lum manbalardan ilova o'rnatish" so'rovini bersa, sozlamalarga o'tib ruxsat bering.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-mono shrink-0">
              2
            </span>
            Foydalanish ruxsatini (Usage Access) yoqing
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Ilovani ochgach, <strong>"Sozlamalarga o'tish"</strong> tugmasini bosing. Ro'yxatdan <strong>Yurak</strong> ilovasini toping va <em>"Foydalanish statistikasiga ruxsat berish"</em> parametrini faollashtiring.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-mono shrink-0">
              3
            </span>
            Hisobingiz bilan tizimga kiring
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Ro'yxatdan o'tgan elektron pochta va parolingizni kiriting. Shundan so'ng telefoningiz
            Dashboard'dagi qurilmalar ro'yxatida avtomatik aks etadi.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-xl bg-bg border border-border space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-ink">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-mono shrink-0">
              4
            </span>
            Batareya tejash cheklovini olib tashlang (Tavsiya)
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pl-8">
            Xiaomi (MIUI/HyperOS), Samsung yoki boshqa telefonlarda fon jarayonlari o'chib qolmasligi uchun:
            Telefon sozlamalari → Ilovalar → Yurak → <strong>"Batareya tejash"</strong> bandida <strong>"Cheklovlarsiz" (No restrictions)</strong> rejimini tanlang.
          </p>
        </div>
      </div>

      {/* Assurance Card */}
      <div className="p-4 rounded-xl bg-good/10 border border-good/20 flex items-start gap-3 text-xs sm:text-sm">
        <ShieldCheck size={20} className="text-good shrink-0 mt-0.5" />
        <div className="text-ink">
          <strong>Xavfsizlik Kafolati:</strong> Ushbu ruxsatlar faqat qaysi ilova qancha daqiqa ochiq turganini va qancha bayt sarflaganini o'lchaydi. Xabarlar, parollar va fotosuratlarga ruxsat berilmaydi.
        </div>
      </div>
    </div>
  );
}

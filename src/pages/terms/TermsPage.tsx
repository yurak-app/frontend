import { usePageTitle } from "../../utils/usePageTitle";
import { FileText, AlertTriangle, CheckCircle, Scale } from "lucide-react";

export function TermsPage() {
  usePageTitle("Foydalanish Shartlari — Yurak");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Rasmiy Hujjat
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Foydalanish Shartlari (Terms of Service)
        </h1>
        <p className="text-sm text-muted">
          Oxirgi yangilanish: 2026-yil 9-noyabr
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 space-y-8 text-sm text-muted leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            1. Shartlarning qabul qilinishi
          </h2>
          <p>
            Yurak vebsayti, uning mobil ilovalari (Android), kompyuter agentlari (Windows) va brauzer kengaytmalaridan (birgalikda "Xizmat") foydalanish orqali siz ushbu Foydalanish Shartlariga to'liq rozilik bildirasiz. Agar siz ushbu shartlarning biror bandiga rozi bo'lmasangiz, Xizmatdan foydalanishni to'xtatishingiz lozim.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Scale size={18} className="text-sky-500" />
            2. Ochiq manbali litsenziya
          </h2>
          <p>
            Yurak dasturiy ta'minotining manba kodlari ochiq bo'lib, jamoatchilik uchun o'rganish, takomillashtirish va mustaqil serverlarda ishga tushirish (self-hosting) uchun erkindir. Dasturiy ta'minotdan foydalanish tegishli ochiq manbali litsenziya shartlari doirasida tartibga solinadi.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            3. Ruxsat etilgan foydalanish va taqiqlar
          </h2>
          <p>
            Xizmat faqat qonuniy va shaxsiy monitoring maqsadlarida foydalanilishi shart. Foydalanuvchiga quyidagilar qat'iyan man etiladi:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Yurak agentlarini boshqa shaxslarning xabarisiz yoki ruxsatisiz ularning qurilmalariga noqonuniy o'rnatish (josuslik yoki yashirin kuzatuv qilish);</li>
            <li>Server infratuzilmasiga ruxsatsiz kirish, xizmat ko'rsatishni to'xtatishga (DDoS) qaratilgan hujumlarni amalga oshirish;</li>
            <li>API so'rovlarini sun'iy ravishda soxtalashtirish yoki tizimga zarar yetkazuvchi ma'lumotlarni yuborish.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            4. Kafolatlar va javobgarlikning cheklanishi
          </h2>
          <p>
            Dasturiy ta'minot "boricha" (<strong>"AS IS"</strong>) tamoyili asosida taqdim etiladi. Ishlab chiquvchilar dasturning uzluksiz, xatosiz ishlashiga yoki apparat vositalari, batareya quvvati hamda tarmoq drayverlari bilan yuzaga kelishi mumkin bo'lgan har qanday nosozliklar uchun qonun doirasida bevosita yoki bilvosita moddiy javobgarlikni o'z zimmalariga olmaydilar.
          </p>
          <p>
            Foydalanuvchi o'z hisob ma'lumotlari (parol, API token) maxfiyligini saqlashga shaxsan javobgardir.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink">
            5. Shartlarni bekor qilish va hisobni yopish
          </h2>
          <p>
            Foydalanuvchi istalgan paytda tizimdagi hisobini o'chirib tashlash orqali ushbu shartnomaviy munosabatlarni bekor qilishi mumkin. Shartlar buzilgan taqdirda, ma'muriyat foydalanuvchi hisobiga kirishni to'xtatish huquqini saqlab qoladi.
          </p>
        </section>
      </div>
    </div>
  );
}


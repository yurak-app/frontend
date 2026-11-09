import { usePageTitle } from "../../utils/usePageTitle";
import { Lock, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export function PrivacyPage() {
  usePageTitle("Maxfiylik Siyosati — Yurak");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Rasmiy Hujjat
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Maxfiylik Siyosati (Privacy Policy)
        </h1>
        <p className="text-sm text-muted">
          Kuchga kirish sanasi: 2026-yil 1-yanvar · Oxirgi yangilanish: 2026-yil 9-noyabr
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 space-y-8 text-sm text-muted leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            1. Umumiy qoidalar va asosiy tamoyil
          </h2>
          <p>
            Yurak platformasi (bundan buyon "Tizim") foydalanuvchilarning shaxsiy ma'lumotlari daxlsizligini eng oliy qadriyat deb biladi. Tizim <strong>"Privacy-First" (Maxfiylik birinchi o'rinda)</strong> arxitekturasi asosida yaratilgan bo'lib, uning yagona maqsadi — foydalanuvchining o'z qurilmalaridagi vaqt va tarmoq trafigini hisoblash va tahlil qilishdir.
          </p>
          <p>
            Tizim tijoriy reklama tarmoqlari, ma'lumot sotuvchilari (data brokers) yoki kuzatuvchi trekerlar bilan mutlaqo hamkorlik qilmaydi.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            2. Qanday ma'lumotlar to'planadi?
          </h2>
          <p>
            Agentlar tomonidan faqat quyidagi texnik telemetriya ko'rsatkichlari to'planadi va qayta ishlanadi:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Ilova identifikatori (App Identifier):</strong> Dasturning paket nomi (masalan, <code>org.telegram.messenger</code> yoki <code>chrome.exe</code>).</li>
            <li><strong>Vaqt ko'rsatkichlari:</strong> Segmentning boshlanish (startedAt) va tugash (endedAt) vaqti hamda uning davomiyligi (soniyalarda).</li>
            <li><strong>Tarmoq trafigi hisobi:</strong> Qabul qilingan va uzatilgan baytlar miqdori (Mobil internet, Wi-Fi va Hotspot bo'yicha ajratilgan holda).</li>
            <li><strong>Tizim holati:</strong> Ekran qulflanishi yoki ochilishi hodisasi (lock/unlock) va batareya foizi ko'rsatkichi.</li>
            <li><strong>Qurilma nomi va platformasi:</strong> Qurilma modeli (masalan: <em>Xiaomi Redmi Note 8 Pro</em>) va operatsion tizim turi (Android, Windows).</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" />
            3. Qanday ma'lumotlar QAT'IYAN TO'PLANMAYDI?
          </h2>
          <p>
            Tizim xavfsizlik va axloqiy me'yorlarga qat'iy rioya qiladi. Quyidagi ma'lumotlar agentlar tomonidan <strong>hech qachon o'qilmaydi, yozib olinmaydi va serverga yuborilmaydi:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-rose-700 dark:text-rose-400">
            <li>Shaxsiy yozishmalar, xabarlar, chatlar va ularning mazmuni;</li>
            <li>Parollar, bank kartalari, to'lov ma'lumotlari yoki avtorizatsiya sessiyalari;</li>
            <li>Klaviatura bosilmalari (keystroke logging) yoki matn kiritmalari;</li>
            <li>Ekran tasvirlari (screenshot), video yozuvlar yoki kamera tasvirlari;</li>
            <li>Mikrofon orqali audio yozuvlar;</li>
            <li>Foydalanuvchining shaxsiy fayllari, fotosuratlari, hujjatlari yoki kontaktlari.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Lock size={18} className="text-sky-500" />
            4. Ma'lumotlarni saqlash va xavfsizlik
          </h2>
          <p>
            Barcha ma'lumotlar shifrlangan PostgreSQL ma'lumotlar bazasida saqlanadi. Agentlar va server o'rtasidagi aloqa zamonaviy TLS/HTTPS shifrlash protokollari orqali himoyalangan. Har bir qurilmaga unikal, qaytarib olinishi mumkin bo'lgan API token biriktiriladi.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink">
            5. Foydalanuvchi huquqlari va ma'lumotlarni o'chirish (Right to Erasure)
          </h2>
          <p>
            Foydalanuvchi o'z hisobi va ma'lumotlarining mutlaq egasidir. Istalgan vaqtda:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Shaxsiy kabinetdagi sozlamalar bo'limi orqali istalgan qurilmani tizimdan uzish va uning tokenini bekor qilish;</li>
            <li>O'z hisobidagi barcha tarixiy hodisalar va telemetriya yozuvlarini bir bosish bilan qaytarib bo'lmas darajada butunlay o'chirib tashlash huquqiga ega.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink">
            6. Maxfiylik siyosatiga o'zgartirishlar kiritish
          </h2>
          <p>
            Ushbu siyosatga o'zgartirishlar kiritilganda, vebsaytning ushbu sahifasida yangilangan sana bilan e'lon qilinadi. Tizimdan foydalanishni davom ettirish o'zgartirishlarga rozilik sifatida qaraladi.
          </p>
        </section>
      </div>
    </div>
  );
}


import { Activity, Clock, Cpu, Database, ShieldCheck, Wifi } from "lucide-react";

const FEATURES = [
  {
    icon: Clock,
    title: "1:1 Ekran Vaqti Aniqligi",
    description:
      "Tizim faqat ekran ochiq va ilova faol (foreground) bo'lgan paytni hisoblaydi. Fon audio yoki yopiq ekran vaqti aralashib ketmaydi.",
  },
  {
    icon: Wifi,
    title: "Tarmoq Sarfi Telemetriyasi",
    description:
      "Mobil internet (SIM-karta), Wi-Fi va boshqa qurilmalarga tarqatilgan Hotspot trafigi alohida baytlar kesimida jamlanadi.",
  },
  {
    icon: Cpu,
    title: "Kross-Platform Arxitektura",
    description:
      "Android telefoni, Windows ishchi kompyuteri va brauzer bir hisob ostida birlashib, umumiy kundalik faollikni yagona manbada aks ettiradi.",
  },
  {
    icon: Database,
    title: "Oflayn Buferlash (Zero Data Loss)",
    description:
      "Internet uzilganda hodisalar lokal SQLite bazasida xavfsiz navbatda turadi. Aloqa tiklangach kichik paketlarda serverga to'liq yetkaziladi.",
  },
  {
    icon: Activity,
    title: "Vaqt Mintaqasi Hisobi (UTC+5)",
    description:
      "Barcha ma'lumotlar Toshkent vaqti bilan qat'iy 00:00:00 dan 23:59:59 gacha bo'lgan kunlik chegaralarga bog'lanadi.",
  },
  {
    icon: ShieldCheck,
    title: "Formal Maxfiylik Kafolati",
    description:
      "Klaviatura matnlari, parollar, xabarlar, kamera yoki shaxsiy fayllar kuzatilmaydi. Faqat ochiq OS darajasidagi vaqt va bayt ko'rsatkichlari saqlanadi.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-border text-xs font-mono text-muted">
            Texnik Xususiyatlar
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Aniq, barqaror va ortiqcha shovqinsiz telemetriya
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Yurak murakkab hisob-kitoblarni operatsion tizimning rasmiy API vositalari orqali xolis, xatosiz va toza amalga oshiradi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-bg border border-border hover:border-accent/40 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent shadow-xs">
                <item.icon size={20} />
              </div>
              <h3 className="font-bold text-base text-ink">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

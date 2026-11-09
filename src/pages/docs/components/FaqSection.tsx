import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Yurak ilovasidan foydalanish bepulmi?",
    a: "Ha, Yurak to'liq ochiq manbali (open-source) va mutlaqo bepul tizimdir. Hech qanday yashirin to'lovlar, reklamalar yoki pullik obunalar yo'q.",
  },
  {
    q: "Ilova mening shaxsiy xabarlarim, fotosuratlarim yoki parollarimni ko'radimi?",
    a: "Mutlaqo yo'q! Yurak telefon yoki kompyuter ichidagi matnlarni, xabarlarni yoki ekran tasvirlarini (screenshot) o'qimaydi. Tizim faqat operatsion tizim bergan rasmiy ko'rsatkichlarni (qaysi dasturda necha daqiqa vaqt o'tgani va necha bayt internet sarflangani) qayd etadi.",
  },
  {
    q: "Nega telefondagi statistika vebsaytda darhol yangilanmayapti?",
    a: "Android batareyasini va mobil internetni tejash maqsadida ma'lumotlar fonda har 15 daqiqada yoki telefon zaryadga ulanganda serverga uzatiladi. Agar statistikani darhol vebda ko'rmoqchi bo'lsangiz, ilova ichidagi 'Yuborish' tugmasini bosing.",
  },
  {
    q: "Internet uzilib qolsa yoki telefon o'chsa ma'lumotlar yo'qoladimi?",
    a: "Yo'q, yo'qolmaydi! Yurak qurilmaning o'zida lokal xotiradan (SQLite) foydalanadi. Internet bo'lmagan paytda barcha soniya va baytlar xavfsiz navbatda turadi va internet paydo bo'lishi bilan serverga to'liq yetkaziladi.",
  },
  {
    q: "Ilova telefon batareyasini tez tugatib qo'ymaydimi?",
    a: "Dastur fonda doimiy ishlab quvvat sarflamaydi. U faqat belgilangan vaqtda qisqa uyg'onadi va operatsion tizim drayveri allaqachon hisoblab qo'ygan raqamlarni olib, yana uyqu rejimiga o'tadi.",
  },
  {
    q: "Windows kompyuterda qaysi dasturda ishlaganim qanday o'lchanadi?",
    a: "Kompyuterda qaysi dastur oynasi ekranda faol turgan bo'lsa (masalan, brauzer, kod muharriri, Word), faqat o'sha dastur vaqti hisoblanadi. Agar kompyuterni tark etsangiz, tizim buni avtomatik tanaffus (idle) deb belgilaydi.",
  },
  {
    q: "Hotspot (tethering) orqali boshqalarga tarqatilgan internet ham ko'rinadimi?",
    a: "Ha! Agar telefoningizdan kompyuterga yoki do'stlaringizga internet tarqatsangiz, ilova bu sarfni alohida 'Hotspot' bo'limida aniq baytigacha ajratib ko'rsatadi.",
  },
  {
    q: "O'z hisobimdagi barcha ma'lumotlarni o'chirish yoki yuklab olish mumkinmi?",
    a: "Albatta. Sozlamalar bo'limi orqali to'plangan barcha telemetriya tarixini CSV yoki JSON formatida yuklab olishingiz yoki hisobingizni butunlay tozalab tashlashingiz mumkin.",
  },
];

export function FaqSection() {
  // Open the first item by default
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  function toggleItem(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  return (
    <section id="faq" className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-border">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">Ko'p Beriladigan Savollar (FAQ)</h2>
          <p className="text-xs text-muted">Foydalanishda uchraydigan eng muhim holatlar va sodda javoblar</p>
        </div>
      </div>

      {/* Accordion / Collapsible items */}
      <div className="space-y-3">
        {FAQS.map((item, index) => {
          const isOpen = openIndexes.includes(index);

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? "bg-bg border-accent/40 shadow-xs"
                  : "bg-bg/60 border-border hover:border-border/80"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3 cursor-pointer bg-transparent border-none"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-xs sm:text-sm text-ink flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface border border-border text-[10px] font-mono text-muted flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span>{item.q}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-muted transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 sm:px-4.5 sm:pb-4.5 text-xs sm:text-sm text-muted leading-relaxed pl-11 animate-fade-in-up border-t border-border/40">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

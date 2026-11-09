import { Activity, ShieldCheck, Target, Users } from "lucide-react";
import { QuestionCardItem, type QuestionCardData } from "./QuestionCardItem";

const QUESTIONS: QuestionCardData[] = [
  {
    number: "01",
    badge: "LOYIHA MOHIYATI",
    badgeColor: "text-accent bg-accent/10 border-accent/20",
    icon: Activity,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Bu loyiha o'zi nima?",
    summary:
      "Yurak — bu smartfon (Android), kompyuter (Windows) va brauzeringizdagi faollikni bitta joyda jamlovchi shaxsiy monitoring platformasi.",
    details: [
      "Operatsion tizim darajasida to'plangan real raqamlar",
      "Barcha qurilmalaringiz uchun bitta umumiy boshqaruv kabineti",
      "Hech qanday reklamalar, obunalar va maxfiy to'lovlarsiz ochiq loyiha",
    ],
  },
  {
    number: "02",
    badge: "ASOSIY MISSIYA",
    badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: Target,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    title: "Loyihaning vazifasi nima?",
    summary:
      "Vaqtingiz va internetingiz qayerga sarflanayotganini daqiqasigacha va baytigacha aniq hisoblab, to'liq haqqoniy hisobot berish.",
    details: [
      "1:1 Aniq ekran vaqti — faqat ekranga qarab turgan sof daqiqalaringiz o'lchanadi",
      "Alohida tarmoq telemetriyasi — Mobil internet (SIM), Wi-Fi va Hotspot ajratiladi",
      "Kunlik, haftalik va yillik faollik tahlillari va taqqoslashlar",
    ],
  },
  {
    number: "03",
    badge: "MAQSADLI AUDITORIYA",
    badgeColor: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    icon: Users,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    title: "Bu loyiha kimlar uchun?",
    summary:
      "O'z vaqtini behuda sarflashni istamaydigan, raqamli odatlarini tartibga solmoqchi bo'lgan har bir zamonaviy inson uchun.",
    details: [
      "Dasturchilar, talabalar va frilanserlar — ish unumdorligi va diqqatni nazorat qilish uchun",
      "Internet foydalanuvchilari — qaysi ilova qancha megabayt yeb qo'yayotganini bilish uchun",
      "O'z vaqtini qadrlaydiganlar — kun oxirida vaqt qayerga ketganini tahlil qilish uchun",
    ],
  },
  {
    number: "04",
    badge: "AFZALLIK VA FARQ",
    badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    icon: ShieldCheck,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    title: "Nima uchun aynan Yurak?",
    summary:
      "Bozordagi ko'plab tijoriy dasturlardan farqli ravishda, Yurak shaxsiy yozishmalaringizni o'g'irlamaydi va sotmaydi.",
    details: [
      "100% Shaxsiy daxlsizlik — yozishmalar, fotosuratlar va parollar kuzatilmaydi",
      "Trekerlar va reklamalardan xoli — ma'lumotlar faqat sizning hisobingizga tegishli",
      "Ochiq manba (Open Source) — xohlagan kishi kodni mustaqil tekshirishi mumkin",
    ],
  },
];

export function AboutQuestions() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Loyiha haqida 4 ta muhim savolga aniq javob
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Ortiqcha murakkab atamalarsiz, oddiy va tushunarli tilda:
        </p>
      </div>

      {/* 1. Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {QUESTIONS.map((item) => (
          <QuestionCardItem key={item.number} item={item} />
        ))}
      </div>

      {/* 2. Mobile Continuous Auto-Scroll Carousel */}
      <div className="block md:hidden -mx-4 overflow-hidden relative">
        <div className="flex w-max gap-4 px-4 animate-loop-scroll">
          {QUESTIONS.map((item) => (
            <QuestionCardItem
              key={`q1-${item.number}`}
              item={item}
              className="w-[82vw] max-w-[310px] shrink-0"
            />
          ))}
          {QUESTIONS.map((item) => (
            <QuestionCardItem
              key={`q2-${item.number}`}
              item={item}
              className="w-[82vw] max-w-[310px] shrink-0"
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-muted pt-3 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>O'qish uchun bosing yoki teging (avtomatik aylanadi)</span>
        </p>
      </div>
    </div>
  );
}

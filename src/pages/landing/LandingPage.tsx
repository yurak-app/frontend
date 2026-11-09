import { usePageTitle } from "../../utils/usePageTitle";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { PlatformsSection } from "./components/PlatformsSection";
import { Link } from "react-router-dom";
import { Download, EyeOff, Lock, ShieldCheck } from "lucide-react";

export function LandingPage() {
  usePageTitle(
    "Yurak — Faollik va Tarmoq Telemetriyasi",
    "Android, Windows va veb-brauzerlar uchun markazlashgan telemetriya platformasi. Operatsion tizim darajasidagi 1:1 aniq ekran vaqti, ilovalar faolligi va tarmoq trafigi hisoboti."
  );

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Features Section */}
      <FeaturesSection />

      {/* 3. Platform Agents */}
      <PlatformsSection />

      {/* 4. Security & Privacy Guarantee (User-Centric) */}
      <section id="security" className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-border text-xs font-mono text-muted">
              Xavfsizlik va Maxfiylik
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Sizning shaxsiy ma'lumotlaringiz 100% daxlsiz
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Yurak platformasi sizning qimmatli vaqtingiz va internetingiz qayerga ketayotganini ko'rsatish uchun yaratilgan. Biz hech qachon shaxsiy hayotingizga aralashmaymiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-bg border border-border space-y-4 hover:border-accent/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="font-bold text-lg text-ink">Shaxsiy xabarlar o'qilmaydi</h3>
              <p className="text-sm text-muted leading-relaxed">
                Ilovalar ichidagi yozishmalar, fotosuratlar, parollar, SMS xabarlar yoki audio/video yozuvlar hech qachon o'qilmaydi va serverga yuborilmaydi.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-bg border border-border space-y-4 hover:border-accent/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <EyeOff size={24} />
              </div>
              <h3 className="font-bold text-lg text-ink">Reklama va trekerlardan xoli</h3>
              <p className="text-sm text-muted leading-relaxed">
                Tizimda reklama tarmoqlari, foydalanuvchi xulq-atvorini kuzatuvchi uchinchi tomon trekerlari umuman mavjud emas. Ma'lumotlar faqat sizga tegishli.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-bg border border-border space-y-4 hover:border-accent/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-lg text-ink">To'liq ma'lumot nazorati</h3>
              <p className="text-sm text-muted leading-relaxed">
                Istalgan paytda barcha to'plangan telemetriya ma'lumotlarini ochiq JSON yoki CSV formatida yuklab olishingiz yoki hisobingizdan butunlay o'chirib tashlashingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-bg text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            O'z qurilmalaringizni monitoring qilishga tayyormisiz?
          </h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            Android APK'ni yuklab oling yoki veb-kabinet orqali yangi hisob yaratib darhol boshlang.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/download"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Download size={16} />
              Ilovalarni yuklab olish
            </Link>
            <Link
              to="/docs"
              className="px-5 py-3 rounded-xl border border-border bg-surface hover:bg-bg text-ink font-semibold text-sm transition-colors"
            >
              O'rnatish qo'llanmasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

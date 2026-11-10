import { ArrowRight, ExternalLink, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { GithubIcon } from "../../../components/ui/GithubIcon";

export function AboutCommunity() {
  const openSourceCard = (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-xs select-none h-full hover:border-accent/40 transition-all">
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-xl bg-ink/10 text-ink border border-border flex items-center justify-center">
          <GithubIcon size={20} />
        </div>
        <h3 className="font-bold text-lg text-ink">100% Ochiq Manba (Open Source)</h3>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Yurak loyihasining barcha qismlari — Android ilovasi, Windows agenti, Chrome kengaytmasi
          va Veb-platformasi — ochiq manbali tarzda GitHub tashkilotida saqlanadi. Har bir dasturchi
          kodni erkin ko'rishi, tekshirishi yoki o'z serverida mustaqil ishlatishi mumkin.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-xs text-muted flex items-center gap-1.5">
          <GithubIcon size={13} className="text-muted" />
          <span>MIT Ochiq Litsenziyasi</span>
        </span>
        <a
          href="https://github.com/yurak-app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg border border-border text-ink hover:border-accent hover:text-accent font-semibold text-xs transition-all shadow-xs"
        >
          <span>yurak-app tashkiloti</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );

  const privacyCard = (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-xs select-none h-full hover:border-accent/40 transition-all">
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <h3 className="font-bold text-lg text-ink">Maxfiylik va Halollik Kafolati</h3>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Biz sizning shaxsiy xabarlaringiz, fotosuratlaringiz, parollaringiz yoki fayllaringizni
          hech qachon o'qimaymiz va saqlamaymiz. Faqat qaysi ilova qancha vaqt faol bo'lgani va
          qancha bayt internet sarflagani hisoblanadi.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-xs text-muted flex items-center gap-1.5">
          <Lock size={13} className="text-emerald-500" />
          <span>Ma'lumotlar to'liq shifrlangan</span>
        </span>
        <Link
          to="/privacy"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bg border border-border text-ink hover:border-accent hover:text-accent font-semibold text-xs transition-all shadow-xs"
        >
          <span>Maxfiylik siyosati</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 1. Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {openSourceCard}
        {privacyCard}
      </div>

      {/* 2. Mobile Continuous Reverse Auto-Scroll */}
      <div className="block md:hidden -mx-4 overflow-hidden relative">
        <div className="flex w-max gap-4 px-4 animate-loop-scroll-reverse">
          <div className="w-[82vw] max-w-[310px] shrink-0">{openSourceCard}</div>
          <div className="w-[82vw] max-w-[310px] shrink-0">{privacyCard}</div>
          <div className="w-[82vw] max-w-[310px] shrink-0">{openSourceCard}</div>
          <div className="w-[82vw] max-w-[310px] shrink-0">{privacyCard}</div>
        </div>

        <p className="text-center text-[11px] text-muted pt-3 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>O'qish uchun bosing yoki teging (avtomatik aylanadi)</span>
        </p>
      </div>
    </div>
  );
}

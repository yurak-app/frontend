import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./ui/GithubIcon";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-surface text-ink mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Main Content Grid: 5 columns on desktop, 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-border">
          {/* Brand info (spans 2 columns on desktop) */}
          <div className="col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
              <img
                src="/logo.png"
                alt="Yurak"
                className="w-8 h-8 rounded-lg shrink-0 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-ink leading-tight">Yurak</span>
                <span className="text-[10px] text-muted font-mono tracking-wider uppercase">
                  Telemetriya & Nazorat
                </span>
              </div>
              <span className="ml-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-good/10 text-good border border-good/20">
                v1.0
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Android, Windows va veb-brauzerlar uchun markazlashgan telemetriya platformasi.
              100% ochiq manbali va shaxsiy ma'lumotlar daxlsiz.
            </p>
          </div>

          {/* Group 1: Platforma */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink/80 block">
              Platforma
            </span>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-muted hover:text-ink transition-colors">
                  Asosiy
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-muted hover:text-ink transition-colors">
                  Imkoniyatlar
                </a>
              </li>
              <li>
                <Link to="/download" className="text-muted hover:text-ink transition-colors font-medium">
                  Yuklab olish
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 2: Hujjatlar */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink/80 block">
              Hujjatlar
            </span>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/docs" className="text-muted hover:text-ink transition-colors">
                  O'rnatish qo'llanmasi
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted hover:text-ink transition-colors">
                  Maxfiylik siyosati
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted hover:text-ink transition-colors">
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3: Loyiha */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink/80 block">
              Loyiha
            </span>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-muted hover:text-ink transition-colors">
                  Loyiha haqida
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/yurak-app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium"
                >
                  <GithubIcon size={14} />
                  <span>yurak-app tashkiloti</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div>
            © {currentYear} Yurak. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-2 text-muted text-[11px] sm:text-xs">
            <span>Ochiq manbali telemetriya</span>
            <span>·</span>
            <span>Toshkent, UTC+5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { Shield, Terminal } from "lucide-react";
import { GithubIcon } from "./ui/GithubIcon";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-surface text-ink mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <img src="/logo.png" alt="Yurak" className="w-7 h-7 rounded-lg shrink-0 object-cover" />
              <span className="font-bold text-lg text-ink">Yurak</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Kross-platform faollik va tarmoq telemetriyasi tizimi. Ekran vaqti, ilovalardan foydalanish va tarmoq trafigi hisoboti.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <span className="w-2 h-2 rounded-full bg-good animate-pulse"></span>
              v1.0.0-beta · Open Source
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Tizim</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted hover:text-ink transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/download" className="text-muted hover:text-ink transition-colors">
                  Yuklab olish markazi
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted hover:text-ink transition-colors">
                  Texnik hujjatlar (Docs)
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted hover:text-ink transition-colors">
                  Boshqaruv paneli (Dashboard)
                </Link>
              </li>
            </ul>
          </div>

          {/* Repositories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Repozitoriylar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/yurak-app/android"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
                >
                  <GithubIcon size={14} /> Android Client
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yurak-app/windows"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
                >
                  <Terminal size={14} /> Windows Agent (.exe)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yurak-app/extension"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
                >
                  <GithubIcon size={14} /> Chrome Extension
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ismaaiiyl/yurak"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
                >
                  <GithubIcon size={14} /> Core / Backend & Web
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Maxfiylik va Huquqiy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors">
                  <Shield size={14} /> Maxfiylik siyosati
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted hover:text-ink transition-colors">
                  Foydalanish shartlari
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted block mt-2">
                  100% shaxsiy va xavfsiz. Ma'lumotlar faqat foydalanuvchiga tegishli.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {currentYear} Yurak Platformasi. Barcha huquqlar himoyalangan.</p>
          <p className="font-mono">Toshkent vaqti (UTC+5) bo'yicha hisob-kitob qilinadi.</p>
        </div>
      </div>
    </footer>
  );
}

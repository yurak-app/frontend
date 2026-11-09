import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, LogIn, Menu, UserPlus, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { GithubIcon } from "./ui/GithubIcon";

export function PublicNavbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-accent font-semibold" : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Yurak" className="w-8 h-8 rounded-lg shrink-0 object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-ink leading-tight tracking-tight">Yurak</span>
            <span className="text-[10px] text-muted font-mono tracking-wider uppercase">Telemetriya & Nazorat</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Asosiy
          </NavLink>
          <a href="/#features" className="text-sm font-medium text-muted hover:text-ink transition-colors">
            Imkoniyatlar
          </a>
          <NavLink to="/download" className={navLinkClass}>
            Yuklab olish
          </NavLink>
          <NavLink to="/docs" className={navLinkClass}>
            Hujjatlar (Docs)
          </NavLink>
          <NavLink to="/privacy" className={navLinkClass}>
            Maxfiylik
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/ismaaiiyl/yurak"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-bg transition-colors"
            title="GitHub Repository"
          >
            <GithubIcon size={19} />
          </a>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-sm"
            >
              Dashboard ga o'tish
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border text-ink font-medium text-sm hover:bg-bg transition-colors"
              >
                <LogIn size={15} />
                Kirish
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-sm"
              >
                <UserPlus size={15} />
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted hover:text-ink rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-5 flex flex-col gap-4 animate-fade-in-up">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            Asosiy
          </NavLink>
          <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted hover:text-ink">
            Imkoniyatlar
          </a>
          <NavLink to="/download" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            Yuklab olish
          </NavLink>
          <NavLink to="/docs" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            Hujjatlar (Docs)
          </NavLink>
          <NavLink to="/privacy" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            Maxfiylik
          </NavLink>
          <NavLink to="/terms" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            Foydalanish shartlari
          </NavLink>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white font-medium text-sm"
              >
                Dashboard ga o'tish <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-ink text-sm font-medium"
                >
                  <LogIn size={15} /> Kirish
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent text-white text-sm font-medium"
                >
                  <UserPlus size={15} /> Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

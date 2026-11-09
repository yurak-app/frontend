import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, FileText, Lock, LogIn, Menu, Shield, UserPlus, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { GithubIcon } from "./ui/GithubIcon";
import { useLandingScrollSpy } from "../hooks/useLandingScrollSpy";

export function PublicNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<number | null>(null);

  const isLanding = location.pathname === "/";
  const activeLandingSection = useLandingScrollSpy(isLanding);

  function handleDropdownEnter() {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDocsDropdownOpen(true);
  }

  function handleDropdownLeave() {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setDocsDropdownOpen(false);
    }, 150);
  }

  function handleFeaturesClick(e: React.MouseEvent) {
    if (isLanding) {
      e.preventDefault();
      const el = document.getElementById("features");
      if (el) {
        const headerOffset = 85;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.pushState(null, "", "/#features");
      }
    } else {
      navigate("/#features");
    }
    setMobileMenuOpen(false);
  }

  function handleHomeClick(e: React.MouseEvent) {
    if (isLanding) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
    setMobileMenuOpen(false);
  }

  // Active state calculations
  const isHomeActive = isLanding && activeLandingSection === "home";
  const isFeaturesActive = isLanding && activeLandingSection === "features";
  const isDownloadActive = location.pathname === "/download";
  const isAboutActive = location.pathname === "/about";
  const isDocsActive = ["/docs", "/privacy", "/terms"].includes(location.pathname);

  const getLinkClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors cursor-pointer select-none ${
      isActive ? "text-accent font-semibold" : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 no-underline">
          <img src="/logo.png" alt="Yurak" className="w-8 h-8 rounded-lg shrink-0 object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-ink leading-tight tracking-tight">Yurak</span>
            <span className="text-[10px] text-muted font-mono tracking-wider uppercase">Telemetriya & Nazorat</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" onClick={handleHomeClick} className={getLinkClass(isHomeActive)}>
            Asosiy
          </Link>

          <a href="/#features" onClick={handleFeaturesClick} className={getLinkClass(isFeaturesActive)}>
            Imkoniyatlar
          </a>

          <Link to="/download" className={getLinkClass(isDownloadActive)}>
            Yuklab olish
          </Link>

          <Link to="/about" className={getLinkClass(isAboutActive)}>
            Loyiha haqida
          </Link>

          {/* Docs / Legal Dropdown with Hover and Click */}
          <div
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              onClick={() => setDocsDropdownOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 py-2 text-sm font-medium transition-colors bg-transparent border-none ${
                isDocsActive ? "text-accent font-semibold" : "text-muted hover:text-ink"
              }`}
              aria-expanded={docsDropdownOpen}
            >
              <span>Hujjatlar</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${docsDropdownOpen ? "rotate-180 text-accent" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {docsDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-64 rounded-2xl bg-surface border border-border shadow-xl p-2 flex flex-col gap-1 z-50 animate-fade-in-up"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  to="/docs"
                  onClick={() => setDocsDropdownOpen(false)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors no-underline ${
                    location.pathname === "/docs"
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-ink hover:bg-bg"
                  }`}
                >
                  <FileText size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <div className="text-xs font-semibold">O'rnatish qo'llanmasi</div>
                    <div className="text-[11px] text-muted font-normal">Android, Windows va kengaytmani ulash</div>
                  </div>
                </Link>

                <Link
                  to="/privacy"
                  onClick={() => setDocsDropdownOpen(false)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors no-underline ${
                    location.pathname === "/privacy"
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-ink hover:bg-bg"
                  }`}
                >
                  <Shield size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <div>
                    <div className="text-xs font-semibold">Maxfiylik siyosati</div>
                    <div className="text-[11px] text-muted font-normal">Xavfsizlik va daxlsizlik kafolati</div>
                  </div>
                </Link>

                <Link
                  to="/terms"
                  onClick={() => setDocsDropdownOpen(false)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors no-underline ${
                    location.pathname === "/terms"
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-ink hover:bg-bg"
                  }`}
                >
                  <Lock size={16} className="mt-0.5 shrink-0 text-sky-500" />
                  <div>
                    <div className="text-xs font-semibold">Foydalanish shartlari</div>
                    <div className="text-[11px] text-muted font-normal">Qoidalar va ochiq litsenziya</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/yurak-app"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-bg transition-colors"
            title="GitHub: yurak-app"
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
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`text-sm font-medium py-1.5 ${isHomeActive ? "text-accent font-semibold" : "text-ink"}`}
          >
            Asosiy
          </Link>
          <a
            href="/#features"
            onClick={handleFeaturesClick}
            className={`text-sm font-medium py-1.5 ${isFeaturesActive ? "text-accent font-semibold" : "text-ink"}`}
          >
            Imkoniyatlar
          </a>
          <Link
            to="/download"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium py-1.5 ${isDownloadActive ? "text-accent font-semibold" : "text-ink"}`}
          >
            Yuklab olish
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium py-1.5 ${isAboutActive ? "text-accent font-semibold" : "text-ink"}`}
          >
            Loyiha haqida
          </Link>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-muted tracking-wider">Hujjatlar</span>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 pl-2 ${location.pathname === "/docs" ? "text-accent font-semibold" : "text-ink"}`}
            >
              • O'rnatish qo'llanmasi
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 pl-2 ${location.pathname === "/privacy" ? "text-accent font-semibold" : "text-ink"}`}
            >
              • Maxfiylik siyosati
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1 pl-2 ${location.pathname === "/terms" ? "text-accent font-semibold" : "text-ink"}`}
            >
              • Foydalanish shartlari
            </Link>
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white font-medium text-sm"
              >
                Dashboard ga o'tish
                <ArrowRight size={15} />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-ink font-medium text-xs text-center"
                >
                  <LogIn size={14} /> Kirish
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-accent text-white font-medium text-xs text-center"
                >
                  <UserPlus size={14} /> Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

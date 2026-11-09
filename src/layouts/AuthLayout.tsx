import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg relative">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border"
        >
          <ArrowLeft size={14} /> Asosiy sahifaga qaytish
        </Link>
      </div>
      <Outlet />
    </div>
  );
}


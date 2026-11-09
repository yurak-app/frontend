import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../components/PublicNavbar";
import { PublicFooter } from "../components/PublicFooter";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <PublicNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}


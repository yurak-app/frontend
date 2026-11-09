import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/** Wraps every authenticated page: sidebar nav + a centered content column. */
export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8 flex justify-center">
        {/* Keyed by pathname so React treats each route's content as a fresh
            element — that's what makes the fade-in-up replay on every
            navigation instead of only once, the first time AppLayout mounts. */}
        <div key={location.pathname} className="w-full flex justify-center animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

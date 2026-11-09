import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

/** Wraps every authenticated page: sidebar nav + a centered content column. */
export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex w-full min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8 flex justify-center">
        <div key={location.pathname} className="w-full flex justify-center animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


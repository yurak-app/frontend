import { Outlet } from "react-router-dom";

/** Wraps /login and /register: full-viewport centered card, no sidebar. */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <Outlet />
    </div>
  );
}

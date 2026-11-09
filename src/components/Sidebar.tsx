import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppWindow, CalendarDays, CalendarRange, LayoutDashboard, Laptop, type LucideIcon, Radio, UserCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

interface NavItem {
  to: string;
  end?: boolean;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/traffic", icon: Radio, label: "Data & Traffic" },
  { to: "/devices", icon: Laptop, label: "Devices" },
  { to: "/report", icon: CalendarRange, label: "Weekly report" },
  { to: "/history", icon: CalendarDays, label: "History" },
  { to: "/apps", icon: AppWindow, label: "Apps & goals" },
];

const accountLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 min-w-0 no-underline text-[0.83rem] px-2.5 py-2.5 rounded-full transition-colors ${
    isActive ? "bg-bg text-accent" : "text-ink hover:bg-bg"
  }`;

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // A sliding pill behind whichever nav item is active — the same
  // measure-and-animate approach as SegmentedControl's thumb, adapted to a
  // vertical list: real position/height read off the DOM rather than assumed,
  // so it stays correct regardless of font metrics or a label wrapping.
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [thumb, setThumb] = useState<{ top: number; height: number } | null>(null);

  const activeItem = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  function measure() {
    const list = listRef.current;
    const el = activeItem ? itemRefs.current.get(activeItem.to) : null;
    if (!list || !el) {
      setThumb(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setThumb({ top: Math.round(elRect.top - listRect.top), height: Math.round(elRect.height) });
  }

  useLayoutEffect(measure, [activeItem?.to]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="w-[220px] shrink-0 h-screen sticky top-0 overflow-y-auto bg-surface border-r border-border flex flex-col p-3.5 py-5"
      aria-label="Main"
    >
      <NavLink to="/" className="flex items-center gap-2.5 font-bold text-[1.05rem] text-ink no-underline px-2.5 py-1.5 mb-5">
        <img src="/logo.png" alt="" className="w-7 h-7 rounded-lg shrink-0" />
        Yurak
      </NavLink>

      <div className="relative flex flex-col gap-0.5" ref={listRef}>
        {thumb && (
          <div
            className="absolute left-0 right-0 rounded-full bg-bg pointer-events-none"
            style={{
              top: thumb.top,
              height: thumb.height,
              transition: "top 220ms cubic-bezier(0.4,0,0.2,1), height 220ms cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )}
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            ref={(el) => {
              if (el) itemRefs.current.set(item.to, el);
              else itemRefs.current.delete(item.to);
            }}
            className={({ isActive }) =>
              `relative z-10 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[0.87rem] font-medium transition-colors ${
                isActive ? "text-accent" : "text-muted hover:text-ink"
              }`
            }
          >
            <item.icon size={17} /> {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex-1" />

      <div className="pt-3.5 border-t border-border">
        <NavLink to="/profile" className={accountLinkClass}>
          {({ isActive }) => (
            <>
              <UserCircle size={22} className={`shrink-0 ${isActive ? "text-accent" : "text-muted"}`} />
              <span className="truncate">{user?.name || user?.email}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

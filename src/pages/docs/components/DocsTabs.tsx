import { Globe, Laptop, Smartphone, LucideIcon } from "lucide-react";

export type DocsTabId = "android" | "windows" | "extension";

interface TabItem {
  id: DocsTabId;
  label: string;
  sub: string;
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
}

const TABS: TabItem[] = [
  {
    id: "android",
    label: "Android Ilovasi",
    sub: "Telefon sozlash",
    icon: Smartphone,
    badge: "v1.0 APK",
    badgeColor: "bg-accent/15 text-accent",
  },
  {
    id: "windows",
    label: "Windows Agenti",
    sub: "Kompyuter dasturi",
    icon: Laptop,
    badge: "v1.0 EXE",
    badgeColor: "bg-sky-500/15 text-sky-500",
  },
  {
    id: "extension",
    label: "Web Extension",
    sub: "Brauzer kengaytmasi",
    icon: Globe,
    badge: "Web Store",
    badgeColor: "bg-purple-500/15 text-purple-500",
  },
];

interface DocsTabsProps {
  activeTab: DocsTabId;
  onChange: (id: DocsTabId) => void;
}

export function DocsTabs({ activeTab, onChange }: DocsTabsProps) {
  return (
    <div className="w-full">
      {/* Mobile Horizontal Tabs & PC 3-Columns Grid */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`shrink-0 w-[78vw] sm:w-auto p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                isActive
                  ? "bg-surface border-accent shadow-md shadow-accent/10 ring-2 ring-accent/20"
                  : "bg-surface/60 border-border hover:bg-surface hover:border-border/80"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-accent text-white" : "bg-bg text-muted"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold truncate ${isActive ? "text-ink" : "text-ink/80"}`}>
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-muted truncate">{tab.sub}</div>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 font-medium ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sm:hidden text-center text-[11px] text-muted pt-1">
        ← Boshqa platformaga o'tish uchun bosing yoki suring →
      </p>
    </div>
  );
}

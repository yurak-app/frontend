import { BookOpen, Download, Globe, Laptop, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export type PlatformKind = "android" | "windows" | "extension";

interface PlatformConfig {
  icon: typeof Smartphone;
  iconBg: string;
  iconColor: string;
  tag: string;
  tagColor: string;
  title: string;
  version: string;
  desc: string;
  specs: { label: string; val: string }[];
  downloadUrl?: string;
  downloadLabel?: string;
  buttonColor?: string;
  guideUrl: string;
  guideLabel: string;
  isStorePending?: boolean;
}

const PLATFORMS: Record<PlatformKind, PlatformConfig> = {
  android: {
    icon: Smartphone,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    tag: "Mobil Ilova",
    tagColor: "text-accent",
    title: "Yurak Android",
    version: "v1.0.0 · APK Fayl",
    desc: "Android 9.0+ uchun moslashtirilgan. Operatsion tizimning rasmiy drayverlari orqali har bir ilova vaqti va sarflangan internet hajmini o'lchaydi.",
    specs: [
      { label: "Talab", val: "Android 9.0+ (API 28+)" },
      { label: "Hajmi", val: "~12 MB" },
      { label: "Arxitektura", val: "arm64-v8a, armeabi-v7a" },
    ],
    downloadUrl: "https://github.com/yurak-app/android/releases/latest",
    downloadLabel: "Android APK Yuklab Olish",
    buttonColor: "bg-accent text-white hover:bg-accent-hover shadow-sm",
    guideUrl: "/docs#android",
    guideLabel: "O'rnatish qo'llanmasi",
  },
  windows: {
    icon: Laptop,
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    tag: "Desktop Agent",
    tagColor: "text-sky-600",
    title: "Yurak Windows",
    version: "v1.0.0 · EXE Installer",
    desc: "Windows kompyuterlari uchun fon agenti. Tizim treyida sokin ishlaydi, aktiv oynalar va dasturlar sarflagan daqiqalarni qayd etadi.",
    specs: [
      { label: "Talab", val: "Windows 10 / 11 (64-bit)" },
      { label: "Muhit", val: ".NET 8.0 Runtime" },
      { label: "Hajmi", val: "~8 MB" },
    ],
    downloadUrl: "https://github.com/yurak-app/windows/releases/latest",
    downloadLabel: "Windows EXE Yuklab Olish",
    buttonColor: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm",
    guideUrl: "/docs#windows",
    guideLabel: "O'rnatish qo'llanmasi",
  },
  extension: {
    icon: Globe,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    tag: "Brauzer Moduli",
    tagColor: "text-purple-600",
    title: "Chrome Extension",
    version: "Manifest V3 · Kengaytma",
    desc: "Chromium asosidagi brauzerlar uchun kengaytma. Veb-saytlar va domenlar bo'yicha aniq sarflangan sof vaqtni hisoblaydi.",
    specs: [
      { label: "Talab", val: "Chromium 100+" },
      { label: "Ruxsat", val: "tabs, storage" },
      { label: "Holati", val: "Do'konga joylanmoqda" },
    ],
    isStorePending: true,
    guideUrl: "/docs#extension",
    guideLabel: "Brauzerga ulash qo'llanmasi",
  },
};

export function ClientPlatformCard({
  kind,
  className = "",
}: {
  kind: PlatformKind;
  className?: string;
}) {
  const cfg = PLATFORMS[kind];
  const Icon = cfg.icon;

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-lg transition-all select-none ${className}`}
    >
      <div className="space-y-4">
        <div
          className={`w-12 h-12 rounded-xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center shrink-0`}
        >
          <Icon size={24} />
        </div>

        <div>
          <div className={`text-xs font-mono font-semibold uppercase ${cfg.tagColor}`}>
            {cfg.tag}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-ink">{cfg.title}</h3>
          <span className="text-[11px] text-muted font-mono">{cfg.version}</span>
        </div>

        <p className="text-xs sm:text-sm text-muted leading-relaxed">{cfg.desc}</p>

        <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted">
          {cfg.specs.map((s, i) => (
            <div key={i}>
              <strong className="text-ink/80">{s.label}:</strong> {s.val}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {cfg.isStorePending ? (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 font-semibold text-xs text-center">
            Chrome Web Store'da tez kunda
          </div>
        ) : (
          <a
            href={cfg.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors ${cfg.buttonColor}`}
          >
            <Download size={15} />
            {cfg.downloadLabel}
          </a>
        )}

        <Link
          to={cfg.guideUrl}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted hover:text-ink hover:bg-bg text-xs font-medium transition-colors"
        >
          <BookOpen size={14} /> {cfg.guideLabel}
        </Link>
      </div>
    </div>
  );
}


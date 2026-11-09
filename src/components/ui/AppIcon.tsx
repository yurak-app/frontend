import { useEffect, useState } from "react";
import { AppWindow, Globe } from "lucide-react";
import { appIconUrl } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

// Session-lived cache, keyed by appId: the same app shows up in several lists
// (dashboard, day-activity dialogs) — fetch and decode its icon once, not once
// per row. Object URLs are deliberately never revoked; there are at most a
// couple dozen distinct apps in an account's lifetime, so the memory this
// holds onto is negligible next to the cost of re-fetching on every render.
const iconUrlCache = new Map<string, Promise<string | null>>();

function loadIconUrl(token: string, appId: string): Promise<string | null> {
  const cached = iconUrlCache.get(appId);
  if (cached) return cached;

  const promise = fetch(appIconUrl(appId), { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => (res.ok ? res.blob() : null))
    .then((blob) => (blob ? URL.createObjectURL(blob) : null))
    .catch(() => null);
  iconUrlCache.set(appId, promise);
  return promise;
}

/** A site's favicon, fetched client-side — no backend involved at all (unlike desktop
 * app icons, which the Windows agent extracts and uploads). Google's favicon service
 * always returns *something* (a generic globe for a domain it doesn't recognize, never
 * a 404), so this is the one branch of AppIcon that skips the loading-state dance —
 * the <img> itself carries a fallback via onError. Note this does send the domain to
 * Google purely to fetch its icon; fine for a glance icon, but worth knowing for a
 * "private tracker" — swap for a same-origin proxy later if that ever matters more
 * than the zero-backend simplicity. */
function FaviconIcon({ domain, size }: { domain: string; size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Globe size={size} className="text-muted shrink-0" />;
  return (
    <img
      src={`https://www.google.com/s2/favicons?sz=${size <= 16 ? 32 : 64}&domain=${encodeURIComponent(domain)}`}
      alt=""
      width={size}
      height={size}
      className="rounded-[4px] shrink-0 object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

/** An agent-reported icon (extracted from the exe by the Windows agent) by appId,
 * falling back to a generic window glyph until it loads or if the app hasn't
 * reported one yet. */
function AgentIcon({ appId, size }: { appId: string; size: number }) {
  const { token } = useAuth();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setUrl(null);
    let cancelled = false;
    loadIconUrl(token, appId).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [token, appId]);

  if (!url) return <AppWindow size={size} className="text-muted shrink-0" />;
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className="rounded-[4px] shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

/**
 * One app's icon, picking the right source by platform: a website (platform
 * "extension", `identifier` is its hostname) renders its favicon directly in the
 * browser — no backend round trip, since favicons are already a public per-domain
 * resource. Everything else falls back to the icon the Windows agent extracted and
 * uploaded, fetched by `appId`. Pass `identifier`/`platform` when you have them
 * (any `AppStat`, `AppInfo`, or `Goal` does); omitting either just means a website
 * renders with the generic app-window glyph instead of its favicon.
 */
export function AppIcon({
  appId,
  identifier,
  platform,
  size = 16,
}: {
  appId: string | null;
  identifier?: string | null;
  platform?: "windows" | "android" | "extension" | null;
  size?: number;
}) {
  if (platform === "extension" && identifier) return <FaviconIcon domain={identifier} size={size} />;
  if (!appId) return <AppWindow size={size} className="text-muted shrink-0" />;
  return <AgentIcon appId={appId} size={size} />;
}

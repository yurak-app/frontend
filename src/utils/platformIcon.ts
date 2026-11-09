import { Globe, Laptop, Smartphone, type LucideIcon } from "lucide-react";

/**
 * One place mapping a device's platform to its icon — used by the devices list,
 * the device details dialog, and the dashboard's device filter. Scales by
 * construction: a new platform (Android, still pending — see plan.md) is one
 * more case added here, not a ternary chain repeated at every call site.
 */
export function platformIcon(platform: "windows" | "android" | "extension"): LucideIcon {
  switch (platform) {
    case "windows":
      return Laptop;
    case "extension":
      return Globe;
    case "android":
      return Smartphone;
  }
}

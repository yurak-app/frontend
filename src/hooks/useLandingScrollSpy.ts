import { useEffect, useState } from "react";

export type LandingSection = "home" | "features" | "none";

/**
 * Custom hook that monitors scroll position on the landing page
 * and determines which section is currently in view (Scroll-Spy).
 *
 * - "home": user is viewing the Hero / top section
 * - "features": user is viewing the #features section
 * - "none": user has scrolled past features (platforms, security, footer, etc.)
 */
export function useLandingScrollSpy(isLandingPage: boolean): LandingSection {
  const [activeSection, setActiveSection] = useState<LandingSection>("home");

  useEffect(() => {
    if (!isLandingPage) {
      setActiveSection("none");
      return;
    }

    const checkActiveSection = () => {
      const scrollY = window.scrollY;

      // 1. Near the top of the landing page: Hero / "Asosiy" is active
      if (scrollY < 180) {
        setActiveSection("home");
        return;
      }

      // 2. Inspect #features element position relative to viewport
      const featuresEl = document.getElementById("features");
      if (featuresEl) {
        const rect = featuresEl.getBoundingClientRect();
        // 64px sticky navbar + 36px threshold
        const headerThreshold = 100;

        if (rect.top <= headerThreshold && rect.bottom > headerThreshold) {
          setActiveSection("features");
          return;
        }
      }

      // 3. User is viewing other sections (Platforms, Security, FAQ, Footer)
      setActiveSection("none");
    };

    // Initial check on mount
    checkActiveSection();

    window.addEventListener("scroll", checkActiveSection, { passive: true });
    window.addEventListener("resize", checkActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkActiveSection);
      window.removeEventListener("resize", checkActiveSection);
    };
  }, [isLandingPage]);

  return activeSection;
}


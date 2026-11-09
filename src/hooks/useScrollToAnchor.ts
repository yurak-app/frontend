import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls to the target anchor element specified in `location.hash`
 * (e.g. /docs#windows or /#features) with smooth scrolling and sticky header offset.
 */
export function useScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // If there is no hash and we just switched path, scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const id = hash.replace("#", "");

    function scrollToElement() {
      const element = document.getElementById(id);
      if (element) {
        // Offset for the 64px sticky header plus extra breathing room
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        return true;
      }
      return false;
    }

    // Attempt immediately
    const found = scrollToElement();

    // If DOM is still mounting (SPA route change), retry after short delays
    if (!found) {
      const t1 = setTimeout(scrollToElement, 60);
      const t2 = setTimeout(scrollToElement, 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname, hash]);
}


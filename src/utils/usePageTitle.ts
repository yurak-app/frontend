import { useEffect } from "react";

/**
 * Sets the document title and dynamically updates the meta description
 * for search engine crawlers and browser tabs.
 */
export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title.startsWith("Yurak") ? title : `Yurak — ${title}`;

    let previousDesc: string | null = null;
    let descEl = document.querySelector('meta[name="description"]');

    if (description) {
      if (descEl) {
        previousDesc = descEl.getAttribute("content");
        descEl.setAttribute("content", description);
      } else {
        descEl = document.createElement("meta");
        descEl.setAttribute("name", "description");
        descEl.setAttribute("content", description);
        document.head.appendChild(descEl);
      }
    }

    return () => {
      document.title = previousTitle;
      if (description && descEl && previousDesc !== null) {
        descEl.setAttribute("content", previousDesc);
      }
    };
  }, [title, description]);
}

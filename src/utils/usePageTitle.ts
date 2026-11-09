import { useEffect } from "react";

/** Sets the browser tab title for the lifetime of the calling page. */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `Yurak — ${title}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePageTitle } from "../../utils/usePageTitle";
import { DocsTabs, type DocsTabId } from "./components/DocsTabs";
import { AndroidGuide } from "./components/AndroidGuide";
import { WindowsGuide } from "./components/WindowsGuide";
import { ExtensionGuide } from "./components/ExtensionGuide";
import { FaqSection } from "./components/FaqSection";

export function DocsPage() {
  usePageTitle(
    "O'rnatish va Sozlash Qo'llanmasi — Yurak",
    "Android, Windows va brauzer kengaytmasini to'g'ri o'rnatish, ruxsatlar berish va sinxronlash bo'yicha bosqichma-bosqich qo'llanma."
  );
  const { hash } = useLocation();

  const [activeTab, setActiveTab] = useState<DocsTabId>("android");

  // Sync platform tab with URL hash (/docs#windows -> opens windows tab)
  useEffect(() => {
    const cleanHash = hash.replace("#", "") as DocsTabId;
    if (["android", "windows", "extension"].includes(cleanHash)) {
      setActiveTab(cleanHash);
    }
  }, [hash]);

  function handleTabChange(tabId: DocsTabId) {
    setActiveTab(tabId);
    window.history.pushState(null, "", `#${tabId}`);

    // Scroll smoothly to top of guide container if scrolled down
    const container = document.getElementById("docs-content");
    if (container) {
      const topOffset = container.getBoundingClientRect().top + window.pageYOffset - 90;
      if (window.scrollY > topOffset) {
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Qo'llanma Markazi
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
          O'rnatish va Sozlash Qo'llanmasi
        </h1>
        <p className="text-xs sm:text-base text-muted leading-relaxed">
          Qurilmangizni tanlang va bosqichma-bosqich o'rnatish yo'riqnomasi bilan tanishing.
        </p>
      </div>

      {/* 2. Platform Filter Tabs (Android, Windows, Extension) */}
      <DocsTabs activeTab={activeTab} onChange={handleTabChange} />

      {/* 3. Selected Platform Guide View */}
      <div id="docs-content" className="w-full">
        {activeTab === "android" && <AndroidGuide />}
        {activeTab === "windows" && <WindowsGuide />}
        {activeTab === "extension" && <ExtensionGuide />}
      </div>

      {/* 4. FAQ Section: Always visible above footer */}
      <FaqSection />
    </div>
  );
}

import { usePageTitle } from "../../utils/usePageTitle";
import { AboutHero } from "./components/AboutHero";
import { AboutQuestions } from "./components/AboutQuestions";
import { AboutCommunity } from "./components/AboutCommunity";

export function AboutPage() {
  usePageTitle(
    "Loyiha Haqida — Yurak",
    "Yurak nima, vazifasi nima, kimlar uchun va nima uchun kerak? Shaxsiy vaqt va internet telemetriyasi loyihasi haqida to'liq ma'lumot."
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* 1. Page Header */}
      <AboutHero />

      {/* 2. Four Core Questions (Nima, Vazifasi, Kim uchun, Nima uchun) */}
      <AboutQuestions />

      {/* 3. Open Source and Privacy Guarantee */}
      <AboutCommunity />
    </div>
  );
}

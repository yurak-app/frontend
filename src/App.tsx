import { Navigate, Route, Routes } from "react-router-dom";
import { RedirectIfAuthed } from "./auth/RedirectIfAuthed";
import { RequireAuth } from "./auth/RequireAuth";
import { PublicLayout } from "./layouts/PublicLayout";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";

// Public pages
import { LandingPage } from "./pages/landing/LandingPage";
import { DownloadPage } from "./pages/download/DownloadPage";
import { DocsPage } from "./pages/docs/DocsPage";
import { AboutPage } from "./pages/about/AboutPage";
import { PrivacyPage } from "./pages/privacy/PrivacyPage";
import { TermsPage } from "./pages/terms/TermsPage";

// Auth pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Authenticated application pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ScreenTimePage } from "./pages/screen-time/ScreenTimePage";
import { AppUsagePage } from "./pages/app-usage/AppUsagePage";
import { DataUsagePage } from "./pages/data-usage/DataUsagePage";
import { DevicesPage } from "./pages/devices/DevicesPage";
import { HistoryPage } from "./pages/history/HistoryPage";
import { WeeklyReportPage } from "./pages/reports/WeeklyReportPage";
import { SettingsPage } from "./pages/settings/SettingsPage";

export function App() {
  return (
    <Routes>
      {/* 1. Public Pages (Landing, Download, Docs, About, Privacy, Terms) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* 2. Authentication Pages (Login, Register) */}
      <Route
        element={
          <RedirectIfAuthed>
            <AuthLayout />
          </RedirectIfAuthed>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 3. Authenticated App Pages */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/screen-time" element={<ScreenTimePage />} />
        <Route path="/app-usage" element={<AppUsagePage />} />
        <Route path="/data-usage" element={<DataUsagePage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/reports" element={<WeeklyReportPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Backwards compatibility aliases */}
        <Route path="/traffic" element={<Navigate to="/data-usage" replace />} />
        <Route path="/apps" element={<Navigate to="/app-usage" replace />} />
        <Route path="/report" element={<Navigate to="/reports" replace />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
      </Route>

      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

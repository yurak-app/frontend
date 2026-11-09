const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function parseResponse<T>(response: Response): Promise<T> {
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // no body — fine for a 204, or some error responses
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

async function authedRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  });
  return parseResponse<T>(response);
}

// Website login never sends a `device` field — that's how the backend tells
// a website login apart from an agent login (which gets an api_token instead).
export function register(email: string, password: string): Promise<AuthResponse> {
  return postJson<AuthResponse>("/auth/register", { email, password });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return postJson<AuthResponse>("/auth/login", { email, password });
}

export function getProfile(token: string): Promise<{ user: AuthUser }> {
  return authedRequest("/auth/me", token);
}

export function updateProfile(token: string, name: string): Promise<{ user: AuthUser }> {
  return authedRequest("/auth/me", token, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

// ---- devices ----

// Free-form hardware/OS specs the agent reports on login (e.g. "Processor",
// "Installed RAM", "Graphics card") — shape is platform-defined, not fixed here.
export type SystemInfo = Record<string, string>;

export interface Device {
  id: string;
  platform: "windows" | "android" | "extension";
  name: string;
  createdAt: string;
  lastSeenAt: string | null;
  revokedAt: string | null;
  systemInfo: SystemInfo | null;
  // Live battery snapshot — null for devices with no battery (most desktops)
  // or that haven't reported one yet.
  batteryLevel: number | null;
  isCharging: boolean | null;
  batteryUpdatedAt: string | null;
  // Approximate — GPS requested first, but most desktops/laptops have no GPS
  // radio so this commonly resolves via Wi-Fi/cell/IP instead; `locationSource`
  // is what actually got used ("gps" | "wifi" | "cellular" | "ip" | "unknown").
  // Reported once per agent login, and commonly null (permission denied, no
  // fix available at all).
  latitude: number | null;
  longitude: number | null;
  locationSource: string | null;
  locationUpdatedAt: string | null;
}

export function getDevices(token: string): Promise<{ devices: Device[] }> {
  return authedRequest("/devices", token);
}

export function revokeDevice(token: string, id: string): Promise<void> {
  return authedRequest(`/devices/${id}`, token, { method: "DELETE" });
}

// ---- apps ----

// Not fetched via authedRequest — this just builds the URL; it's an <img>-style
// resource, fetched with an Authorization header by components/ui/AppIcon.tsx
// (a plain <img src> can't send custom headers, so it can't hit this directly).
export function appIconUrl(appId: string): string {
  return `${API_BASE_URL}/apps/${encodeURIComponent(appId)}/icon`;
}

export interface AppInfo {
  id: string;
  platform: "windows" | "android" | "extension";
  identifier: string;
  displayName: string | null;
  category: string | null;
  createdAt: string;
}

export function getApps(token: string): Promise<{ apps: AppInfo[]; categoryOptions: string[] }> {
  return authedRequest("/apps", token);
}

export function updateAppCategory(token: string, appId: string, category: string | null): Promise<void> {
  return authedRequest(`/apps/${appId}`, token, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });
}

// ---- stats ----

// One entry per (app, device) pair — the same app on two devices (e.g. two
// Windows PCs) is two separate entries, not merged, so usage is attributable
// to a specific machine.
export interface AppStat {
  appId: string;
  identifier: string;
  displayName: string | null;
  deviceId: string;
  deviceName: string;
  platform: "windows" | "android" | "extension";
  totalSeconds: number;
  // Distinct foreground sessions of this app on this device over the period —
  // "2h across 4 sessions" vs "2h across 40". 0 for data predating session tracking.
  sessionCount: number;
  wifiBytes?: number;
  cellularBytes?: number;
  hotspotBytes?: number;
  totalBytes?: number;
}

export interface DailyStats {
  date: string;
  apps: AppStat[];
  // How many times the foreground app actually changed that day (not the raw
  // segment-row count — see the backend's countAppSwitches doc comment).
  switchCount: number;
  // Distinct app sessions opened that day, across all apps (sum of per-app sessionCount).
  sessionCount: number;
  idleSeconds: number;
  activeChargingSeconds: number;
  // Seconds the screen was unlocked/awake (from lock/unlock/suspend events), or
  // null when no device reported any lock/unlock signal for the day.
  screenSeconds: number | null;
  totalWifiBytes?: number;
  totalCellularBytes?: number;
  totalHotspotBytes?: number;
  totalBytes?: number;
}

export interface RangeStats {
  start: string;
  end: string;
  daily: {
    date: string;
    totalSeconds: number;
    wifiBytes?: number;
    cellularBytes?: number;
    hotspotBytes?: number;
    totalBytes?: number;
  }[];
  topApps: AppStat[];
}

// `deviceId` scopes the response to one device (the dashboard's device filter) —
// omitted, this is the combined across-devices view, same as before it existed.
export function getDailyStats(token: string, date?: string, deviceId?: string): Promise<DailyStats> {
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  if (deviceId) query.set("deviceId", deviceId);
  const qs = query.toString();
  return authedRequest(`/stats/daily${qs ? `?${qs}` : ""}`, token);
}

export function getRangeStats(token: string, start: string, end: string, deviceId?: string): Promise<RangeStats> {
  const query = new URLSearchParams({ start, end });
  if (deviceId) query.set("deviceId", deviceId);
  return authedRequest(`/stats/range?${query}`, token);
}

export interface BatteryReading {
  id: string;
  deviceId: string;
  level: number;
  isCharging: boolean;
  recordedAt: string;
}

export function getBatteryHistory(
  token: string,
  date: string,
  deviceId: string
): Promise<{ date: string; readings: BatteryReading[] }> {
  const query = new URLSearchParams({ date, deviceId });
  return authedRequest(`/stats/battery?${query}`, token);
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  // 7 entries, Monday first — matches dayOfWeekAverages' indexing.
  days: { date: string; totalSeconds: number }[];
  // 7 entries, Monday first: the trailing-4-week average for that weekday —
  // the "monthly average by day of week" comparison band on the chart.
  dayOfWeekAverages: number[];
  dailyAverageSeconds: number;
  activeAverageSeconds: number;
  inactiveAverageSeconds: number;
}

export function getWeeklyReport(token: string, weekStart: string): Promise<WeeklyReport> {
  return authedRequest(`/stats/weekly?start=${encodeURIComponent(weekStart)}`, token);
}

export interface Heatmap {
  start: string;
  end: string;
  // 7 rows (Sun..Sat), each 24 hourly totals — same weekday indexing as WeeklyReport.
  cells: number[][];
}

export function getHeatmap(token: string, days = 28): Promise<Heatmap> {
  return authedRequest(`/stats/heatmap?days=${days}`, token);
}

// A plain <a href> can't carry an Authorization header, so the export button
// fetches the file itself (with the header) and saves the resulting blob —
// see utils/download.ts for the actual save step.
export async function fetchExport(token: string, start: string, end: string, format: "csv" | "json"): Promise<Blob> {
  const query = new URLSearchParams({ start, end, format });
  const response = await fetch(`${API_BASE_URL}/stats/export?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ApiError(response.status, `Export failed (${response.status})`);
  return response.blob();
}

// ---- goals ----

export interface Goal {
  id: string;
  appId: string | null;
  appIdentifier: string | null;
  appDisplayName: string | null;
  appPlatform: "windows" | "android" | "extension" | null;
  limitSeconds: number;
  actualSeconds: number;
}

export function getGoals(token: string): Promise<{ goals: Goal[] }> {
  return authedRequest("/goals", token);
}

export function createGoal(token: string, appId: string | null, limitSeconds: number): Promise<Goal> {
  return authedRequest("/goals", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId, limitSeconds }),
  });
}

export function deleteGoal(token: string, id: string): Promise<void> {
  return authedRequest(`/goals/${id}`, token, { method: "DELETE" });
}

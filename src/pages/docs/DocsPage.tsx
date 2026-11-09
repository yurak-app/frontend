import { usePageTitle } from "../../utils/usePageTitle";
import { Code, Cpu, Globe, Laptop, Smartphone } from "lucide-react";

export function DocsPage() {
  usePageTitle("Hujjatlar — Yurak Telemetriya Platformasi");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          Texnik Hujjatlar
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Yurak Tizimi va API Spetsifikatsiyasi
        </h1>
        <p className="text-base text-muted leading-relaxed">
          Platformaning ichki ishlash tamoyillari, agentlar arxitekturasi va REST API integratsiya qo'llanmasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation / Quick Links sidebar */}
        <aside className="lg:col-span-1 space-y-2 lg:sticky lg:top-24 h-fit">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Mundarija</div>
          <a href="#overview" className="block text-sm text-ink hover:text-accent py-1">1. Tizim umumiy ko'rinishi</a>
          <a href="#android" className="block text-sm text-muted hover:text-accent py-1">2. Android Agent telemetriyasi</a>
          <a href="#windows" className="block text-sm text-muted hover:text-accent py-1">3. Windows Desktop Agenti</a>
          <a href="#extension" className="block text-sm text-muted hover:text-accent py-1">4. Brauzer Kengaytmasi</a>
          <a href="#backend" className="block text-sm text-muted hover:text-accent py-1">5. Backend va Ma'lumotlar Bazasi</a>
          <a href="#api" className="block text-sm text-muted hover:text-accent py-1">6. REST API Spetsifikatsiyasi</a>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-12">
          {/* Section 1: Overview */}
          <section id="overview" className="rounded-2xl border border-border bg-surface p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-accent font-bold">
              <Cpu size={22} />
              <h2 className="text-xl font-bold text-ink">1. Tizim umumiy ko'rinishi</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Yurak — bu ko'p manbali mijoz-server arxitekturasiga asoslangan tizim. Har bir mijoz qurilma (Android telefoni, Windows kompyuteri, Web brauzer) mahalliy resurslar orqali faqat o'z platformasining vaqt va tarmoq drayverlarini tekshiradi va davriy ravishda REST API orqali markaziy serverga hisobot beradi.
            </p>
            <div className="p-4 rounded-xl bg-bg border border-border font-mono text-xs text-ink space-y-1">
              <div>[Android OS] → UsageStatsManager + NetworkStatsManager → SQLite Queue → REST API</div>
              <div>[Windows OS] → Win32 GetForegroundWindow → Local Queue → REST API</div>
              <div>[Browser Ext] → chrome.tabs API → Local Storage → REST API</div>
              <div className="text-accent font-semibold pt-1">→ PostgreSQL Database (Asia/Tashkent UTC+5 Rollup Engine) → Web Dashboard</div>
            </div>
          </section>

          {/* Section 2: Android Agent */}
          <section id="android" className="rounded-2xl border border-border bg-surface p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-accent font-bold">
              <Smartphone size={22} />
              <h2 className="text-xl font-bold text-ink">2. Android Agent telemetriyasi</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Android agenti <code>com.yurak.agent</code> quyidagi asosiy tamoyillar asosida ishlaydi:
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1">
                <span className="font-semibold text-ink block">UsageEvents va Segmentlar (UsageEventReader.kt)</span>
                <p className="text-xs text-muted leading-relaxed">
                  Operatsion tizimning <code>UsageStatsManager.queryEvents(since, now)</code> metodi chaqiriladi. Faqat <code>MOVE_TO_FOREGROUND</code> (ACTIVITY_RESUMED) va <code>MOVE_TO_BACKGROUND</code> (ACTIVITY_PAUSED) hodisalari asosida segmentlar yopiladi. Klaviaturalar (Gboard, Swiftkey), Launcher (Home) va tizim interfeysi (SystemUI) hisobdan chiqariladi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1">
                <span className="font-semibold text-ink block">Tarmoq Sarfi Tahlili (NetworkTrafficReader.kt)</span>
                <p className="text-xs text-muted leading-relaxed">
                  <code>NetworkStatsManager.querySummary</code> orqali har bir UID bo'yicha qabul qilingan (rx) va uzatilgan (tx) baytlar o'lchanadi. <code>ConnectivityManager.TYPE_MOBILE</code> (Mobil), <code>TYPE_WIFI</code> (Wi-Fi) va <code>UID_TETHERING (-5)</code> (Hotspot) drayverlari mustaqil ajratiladi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bg border border-border space-y-1">
                <span className="font-semibold text-ink block">Ishonchli Sinxronizatsiya (SyncWorker.kt)</span>
                <p className="text-xs text-muted leading-relaxed">
                  Android WorkManager vositasi 15 daqiqalik davriy intervallarda yoki foydalanuvchi "Yuborish" tugmasini bosganda ishga tushadi. Hodisalar 50 tadan to'plamda <code>POST /api/v1/events</code> manziliga yo'llanadi.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Windows Desktop */}
          <section id="windows" className="rounded-2xl border border-border bg-surface p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-sky-500 font-bold">
              <Laptop size={22} />
              <h2 className="text-xl font-bold text-ink">3. Windows Desktop Agenti</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Windows agenti C# / .NET 8.0 texnologiyasida yozilgan bo'lib, fon rejimida (System Tray) ishlaydi:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted space-y-1.5 leading-relaxed">
              <li>Win32 <code>GetForegroundWindow</code> orqali faol dasturning jarayon nomi (Process Name) va oyna sarlavhasi o'qiladi.</li>
              <li>Foydalanuvchi kompyuterni tark etganda (idle state) monitoring to'xtatilib, "idle" hodisasi sifatida belgilanadi.</li>
              <li>Tizim quvvati o'chirilganda yoki qulflanganda segment avtomatik yopiladi.</li>
            </ul>
          </section>

          {/* Section 4: Web Extension */}
          <section id="extension" className="rounded-2xl border border-border bg-surface p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-purple-500 font-bold">
              <Globe size={22} />
              <h2 className="text-xl font-bold text-ink">4. Brauzer Kengaytmasi</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Google Chrome va boshqa Chromium brauzerlar uchun Manifest V3 standarti:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted space-y-1.5 leading-relaxed">
              <li>Brauzer tablari faolligini <code>chrome.tabs.onActivated</code> orqali kuzatadi.</li>
              <li>Faqat veb-sayt domeni (masalan: <code>github.com</code>) va sarflangan daqiqalar saqlanadi.</li>
              <li>Sahifaning ichidagi shaxsiy kontent yoki matnlar hech qachon o'qilmaydi.</li>
            </ul>
          </section>

          {/* Section 5: REST API */}
          <section id="api" className="rounded-2xl border border-border bg-surface p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-emerald-500 font-bold">
              <Code size={22} />
              <h2 className="text-xl font-bold text-ink">5. REST API Spetsifikatsiyasi</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Barcha agentlar server bilan HTTPS orqali muloqot qiladi. Har bir so'rov <code>Authorization: Bearer &lt;api_token&gt;</code> sarlavhasini talab qiladi.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
                <div className="text-accent font-bold">POST /api/v1/events</div>
                <div className="text-muted">Agentdan telemetriya hodisalarini qabul qilish (Idempotent batch).</div>
                <pre className="text-ink p-3 rounded-lg bg-surface border border-border overflow-x-auto">
{`// Headers: Authorization: Bearer <device_api_token>
{
  "events": [
    {
      "eventType": "app_usage",
      "appIdentifier": "com.instagram.android",
      "appDisplayName": "Instagram",
      "startedAt": "2026-11-09T10:00:00Z",
      "endedAt": "2026-11-09T10:15:00Z",
      "durationSeconds": 900,
      "cellularBytes": 52428800,
      "wifiBytes": 0,
      "hotspotBytes": 0,
      "sessionStart": true
    }
  ]
}`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
                <div className="text-accent font-bold">GET /api/v1/devices/{`{deviceId}`}/daily?date=YYYY-MM-DD</div>
                <div className="text-muted">Belgilangan sana uchun umumlashtirilgan kunlik statistikani olish.</div>
              </div>

              <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
                <div className="text-accent font-bold">GET /api/v1/stats/range?start=YYYY-MM-DD&end=YYYY-MM-DD</div>
                <div className="text-muted">Kunlar oralig'idagi umumiy faollik va tarmoq trafigini hisoblash.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

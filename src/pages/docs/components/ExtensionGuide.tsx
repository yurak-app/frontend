import { CheckCircle2, Globe, Shield, Sparkles } from "lucide-react";

export function ExtensionGuide() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-8 animate-fade-in-up">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Brauzer Kengaytmasi (Extension)</h2>
            <p className="text-xs text-muted">Google Chrome, Microsoft Edge, Brave va Chromium brauzerlar uchun</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 font-semibold text-xs shrink-0">
          <Sparkles size={14} />
          Chrome Web Store'da tez kunda
        </div>
      </div>

      {/* Overview Note */}
      <div className="p-4 rounded-xl bg-bg border border-border text-xs sm:text-sm text-muted leading-relaxed">
        Kengaytma brauzeringizda qaysi veb-saytlarda (YouTube, GitHub, LeetCode va h.k.) sof faol vaqt
        o'tkazayotganingizni domenlar kesimida o'lchaydi.
      </div>

      {/* Feature Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-bg border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-ink">
            <CheckCircle2 size={16} className="text-good shrink-0" />
            Domenlar kesimida tahlil
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Faqat sayt domeni (masalan, <code>youtube.com</code>) qayd etiladi. Sahifaning to'liq URL manzili yoki ichki yozishmalari saqlanmaydi.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bg border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-ink">
            <CheckCircle2 size={16} className="text-good shrink-0" />
            Xavfsiz Manifest V3
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Google'ning eng qat'iy xavfsizlik standarti (Manifest V3) asosida ishlaydi va kompyuter quvvatini ortiqcha sarflamaydi.
          </p>
        </div>
      </div>

      {/* Status Notice */}
      <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3.5 text-xs sm:text-sm">
        <Shield size={20} className="text-purple-600 shrink-0 mt-0.5" />
        <div className="text-ink leading-relaxed">
          <strong>Do'konga joylanmoqda:</strong> Rasmiy Chrome Web Store nashri chiqqandan so'ng, ushbu sahifada bir bosish bilan o'rnatish tugmasi faollashadi. Ungacha shaxsiy kompyuter va telefon telemetriyasidan to'liq foydalanishingiz mumkin.
        </div>
      </div>
    </div>
  );
}


import { Heart } from "lucide-react";

export function AboutHero() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted shadow-2xs">
        <Heart size={14} className="text-accent fill-accent/20" />
        <span>Loyiha Haqida</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight">
        Yurak o'zi nima va u sizga qanday yordam beradi?
      </h1>

      <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
        Har bir insonning eng qimmatli boyligi — bu uning vaqti va sog'lom diqqati.
        Yurak telefon va kompyuter ekranlarida sarflanayotgan qimmatli daqiqalaringiz hamda
        internetingizni xolis va haqqoniy ko'rsatib beruvchi ochiq tizimdir.
      </p>
    </div>
  );
}

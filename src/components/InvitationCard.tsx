import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useLang } from "@/lib/i18n";
import { EVENT } from "@/lib/event";

export function InvitationCard() {
  const { lang } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const date = new Date(EVENT.dateISO);
  const dateStr = date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = date.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `invitation-${EVENT.bride.en}-${EVENT.groom.en}.png`;
      link.href = dataUrl;
      link.click();
    } finally { setBusy(false); }
  };

  const share = async () => {
    if (!cardRef.current) return;
    if (!navigator.share) return download();
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "invitation.png", { type: "image/png" });
      await navigator.share({ files: [file], title: `${EVENT.bride.en} & ${EVENT.groom.en}`, text: "You're invited to our engagement ✨" });
    } catch { /* cancelled */ }
    finally { setBusy(false); }
  };

  return (
    <section id="card" className="relative px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {lang === "en" ? "Keepsake" : "تذكار"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
        >
          {lang === "en" ? "Your invitation card" : "بطاقتك التذكارية"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-10"
        >
          <div ref={cardRef} className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl"
            style={{
              background: "radial-gradient(ellipse at top, #ffffff 0%, #fdeef2 78%)",
              boxShadow: "var(--shadow-elegant)",
            }}>
            <div className="absolute inset-3 rounded-2xl border border-gold/30" />
            <div className="absolute inset-5 rounded-2xl border border-gold/15" />
            <div className="relative flex h-full flex-col items-center justify-between p-10 text-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.5em] text-gold-soft/80">
                  {lang === "en" ? "Engagement" : "خطوبة"}
                </p>
                <div className="divider-gold mx-auto mt-3 w-16" />
              </div>

              <div>
                <p className="font-script text-5xl text-gradient-gold leading-none">
                  {EVENT.bride[lang]}
                </p>
                <p className="my-3 font-display italic text-2xl text-gold">&</p>
                <p className="font-script text-5xl text-gradient-gold leading-none">
                  {EVENT.groom[lang]}
                </p>
              </div>

              <div className="space-y-2">
                <div className="divider-gold mx-auto w-24" />
                <p className="font-display text-base italic text-ivory">{dateStr}</p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold-soft">{timeStr}</p>
                <p className="font-display text-sm italic text-foreground/70">{EVENT.venue.name[lang]}</p>
                <p className="mt-3 text-[9px] uppercase tracking-[0.4em] text-foreground/40">{EVENT.hashtag}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={download} disabled={busy}
            className="rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] hover:scale-[1.02] transition-transform disabled:opacity-50">
            {busy ? "…" : (lang === "en" ? "Download" : "تحميل")}
          </button>
          <button onClick={share} disabled={busy}
            className="rounded-full glass px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold hover:scale-[1.02] transition-transform">
            {lang === "en" ? "Share" : "شارك"}
          </button>
        </div>
      </div>
    </section>
  );
}

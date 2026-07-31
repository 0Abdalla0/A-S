import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useInvitationData } from "@/lib/invitation-data";
import { burstGold } from "@/lib/confetti";
import { Link } from "@tanstack/react-router";

const colors = ["#b06a7c", "#8e4c5f", "#c9a227", "#8a6fa8", "#5f8b93", "#4b3a3f"];

type Msg = { name: string; text: string; color: string; ts: number };

const seed: Msg[] = [];

export function Messages({ onSent }: { onSent?: () => void }) {
  const { t, lang } = useLang();
  const { msgs, ready, submitMessage } = useInvitationData();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list: Msg[] = [
    ...msgs.map((m) => ({ name: m.name, text: m.text, color: m.color, ts: m.ts })),
    ...seed,
  ];

  // Spotlight index state
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Periodically rotate through spotlight messages
  useEffect(() => {
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [list.length]);

  const send = async () => {
    if (!text.trim()) return;
    const finalName = name.trim() || (lang === "en" ? "Guest" : "ضيف");

    try {
      setSending(true);
      setError(null);
      await submitMessage({
        name: finalName,
        text: text.trim(),
        color,
        language: lang,
      });
      setName("");
      setText("");
      burstGold();
      onSent?.();
    } catch (err) {
      console.error(err);
      setError(
        lang === "en" ? "Unable to send your message right now." : "تعذر إرسال رسالتك حاليًا.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
          >
            {t("messages")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
          >
            {t("messagesSub")}
          </motion.h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass rounded-2xl p-6 sm:p-8 h-fit"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className="w-full rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none transition-all placeholder:text-foreground/40 focus:border-gold/60 focus:shadow-[var(--shadow-gold)]"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("yourMessage")}
              rows={5}
              className="mt-3 w-full resize-none rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none transition-all placeholder:text-foreground/40 focus:border-gold/60 focus:shadow-[var(--shadow-gold)]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                fontStyle: "italic",
                color,
              }}
            />

            <div className="mt-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                {lang === "en" ? "Color" : "اللون"}
              </span>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${
                      color === c ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ background: c }}
                    aria-label="color"
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-border/30 bg-onyx/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                {lang === "en" ? "Preview" : "معاينة"}
              </p>
              <p className="mt-2 font-display italic" style={{ color, fontSize: "1.1rem" }}>
                {text || (lang === "en" ? "Your message will glow here..." : "ستظهر رسالتك هنا...")}
              </p>
              <p className="mt-2 text-xs text-foreground/50">
                — {name || (lang === "en" ? "You" : "أنت")}
              </p>
            </div>

            <button
              onClick={() => {
                void send();
              }}
              disabled={!text.trim() || !ready || sending}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? (lang === "en" ? "Sending..." : "جاري الإرسال...") : t("send")}
            </button>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </motion.div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {list.length > 0 ? (
                  (() => {
                    const m = list[spotlightIndex] || list[0];
                    if (!m) return null;
                    return (
                      <motion.div
                        key={m.ts + m.name}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="glass-gold rounded-3xl p-6 sm:p-8 text-center w-full shadow-[var(--shadow-gold)] relative flex flex-col justify-center h-full min-h-[220px]"
                      >
                        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.22em] text-gold-soft/80 font-semibold px-2 py-0.5 border border-gold-soft/30 rounded-full">
                          {lang === "en" ? "Spotlight" : "تهنئة مميزة"}
                        </span>

                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="mx-auto text-gold-soft/30 mb-4 mt-2"
                        >
                          <path
                            d="M11.19 12c0 2.2-1.79 4-4 4s-4-1.8-4-4c0-2.2 2-6 6-8l.5 1.5c-2.5 1.5-2.5 3-2.5 3.5.5-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4zm9 0c0 2.2-1.79 4-4 4s-4-1.8-4-4c0-2.2 2-6 6-8l.5 1.5c-2.5 1.5-2.5 3-2.5 3.5.5-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4z"
                            fill="currentColor"
                          />
                        </svg>

                        <p
                          className="font-display italic leading-relaxed text-lg sm:text-xl font-light"
                          style={{ color: m.color }}
                        >
                          "{m.text}"
                        </p>
                        <p className="mt-4 font-semibold text-sm text-foreground/75">— {m.name}</p>
                      </motion.div>
                    );
                  })()
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-3xl p-6 sm:p-8 text-center w-full flex items-center justify-center min-h-[220px]"
                  >
                    <p className="font-display italic text-foreground/50">
                      {lang === "en"
                        ? "Leave a wish to light up the page!"
                        : "اكتب تهنئة لتضيء هذه الصفحة!"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8">
              <Link
                to="/wishes"
                className="rounded-full bg-gradient-to-r from-gold-deep to-gold px-8 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === "en" ? "See all wishes" : "مشاهدة كل التهاني"}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  {lang === "ar" ? (
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  ) : (
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  )}
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

type Choice = "yes" | "maybe" | "no" | null;

export function RSVP({ onSubmit }: { onSubmit?: () => void }) {
  const { t, lang } = useLang();
  const [choice, setChoice] = useState<Choice>(null);
  const [submitted, setSubmitted] = useState(false);
  // Mock counts (pretend live)
  const counts = { yes: 142 + (choice === "yes" ? 1 : 0), maybe: 18, no: 7 };
  const total = counts.yes + counts.maybe + counts.no;

  const handle = (c: Exclude<Choice, null>) => {
    setChoice(c);
    setTimeout(() => {
      setSubmitted(true);
      onSubmit?.();
    }, 400);
  };

  const options: { key: Exclude<Choice, null>; label: string; tone: string }[] = [
    { key: "yes", label: t("attending"), tone: "from-gold-deep to-gold" },
    { key: "maybe", label: t("maybe"), tone: "from-card to-secondary" },
    { key: "no", label: t("decline"), tone: "from-card to-secondary" },
  ];

  return (
    <section id="rsvp" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {t("rsvp")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
        >
          {t("rsvpSub")}
        </motion.h2>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {options.map((o) => (
                <motion.button
                  key={o.key}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handle(o.key)}
                  className={`group relative overflow-hidden rounded-2xl glass p-6 text-left transition-all ${
                    choice === o.key ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${o.tone} opacity-0 transition-opacity group-hover:opacity-20`} />
                  <p className="relative font-display text-xl italic text-ivory">{o.label}</p>
                  <p className="relative mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                    {lang === "en" ? "Tap to select" : "اضغط للاختيار"}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mt-12 rounded-2xl glass-gold p-8"
            >
              <p className="font-display text-3xl italic text-gradient-gold">{t("rsvpThanks")}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live stats */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("attending"), val: counts.yes },
            { label: t("maybe"), val: counts.maybe },
            { label: t("decline"), val: counts.no },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="rounded-2xl glass p-5"
            >
              <p className="font-display text-4xl text-gradient-gold">{s.val}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/60">{s.label}</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-gold-deep to-gold"
                  style={{ width: `${(s.val / Math.max(total, 1)) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

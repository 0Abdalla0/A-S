import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useInvitationData } from "@/lib/invitation-data";
import { burstGold } from "@/lib/confetti";

type Choice = "yes" | "maybe" | "no" | null;

export function RSVP({ onSubmit }: { onSubmit?: () => void }) {
  const { t, lang } = useLang();
  const { ready, rsvps, submitRsvp } = useInvitationData();
  const [choice, setChoice] = useState<Choice>(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const counts = {
    yes: 0 + rsvps.filter((r) => r.choice === "yes").reduce((s, r) => s + r.guests, 0),
    maybe: 0 + rsvps.filter((r) => r.choice === "maybe").length,
    no: 0 + rsvps.filter((r) => r.choice === "no").length,
  };
  const total = counts.yes + counts.maybe + counts.no;

  const handle = (c: Exclude<Choice, null>) => {
    setChoice(c);
  };

  const submit = async () => {
    if (!choice) return;

    try {
      setSaving(true);
      setError(null);
      await submitRsvp({
        name: name.trim() || (lang === "en" ? "Guest" : "Ø¶ÙŠÙ"),
        choice,
        guests: Math.max(1, guests),
        language: lang,
      });
      setSubmitted(true);
      burstGold();
      onSubmit?.();
    } catch (err) {
      console.error(err);
      setError(
        lang === "en"
          ? "Unable to send RSVP right now."
          : "ØªØ¹Ø°Ø± Ø¥Ø±Ø³Ø§Ù„ ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¶ÙˆØ± Ø­Ø§Ù„ÙŠÙ‹Ø§.",
      );
    } finally {
      setSaving(false);
    }
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {t("rsvp")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
        >
          {t("rsvpSub")}
        </motion.h2>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
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
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${o.tone} opacity-0 transition-opacity group-hover:opacity-20`}
                  />
                  <p className="relative font-display text-xl italic text-ivory">{o.label}</p>
                  <p className="relative mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                    {lang === "en" ? "Tap to select" : "Ø§Ø¶ØºØ· Ù„Ù„Ø§Ø®ØªÙŠØ§Ø±"}
                  </p>
                </motion.button>
              ))}
              <div className="mt-2 grid gap-3 sm:col-span-3 sm:grid-cols-[2fr_1fr_auto]">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("yourName")}
                  className="rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none placeholder:text-foreground/40 focus:border-gold/60"
                />
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) => setGuests(+e.target.value)}
                  className="rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60"
                />
                <button
                  onClick={() => {
                    void submit();
                  }}
                  disabled={!choice || !ready || saving}
                  className="rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  {saving
                    ? lang === "en"
                      ? "Sending..."
                      : "Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„..."
                    : t("send")}
                </button>
              </div>
              {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 rounded-2xl glass-gold p-8"
            >
              <p className="font-display text-3xl italic text-gradient-gold">{t("rsvpThanks")}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("attending"), val: counts.yes },
            { label: t("maybe"), val: counts.maybe },
            { label: t("decline"), val: counts.no },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="rounded-2xl glass p-5"
            >
              <p className="font-display text-4xl text-gradient-gold">{s.val}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                {s.label}
              </p>
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

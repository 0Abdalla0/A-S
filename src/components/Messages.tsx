import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { store } from "@/lib/store";
import { burstGold } from "@/lib/confetti";

const colors = [
  "#b06a7c", // rose gold
  "#8e4c5f", // deep rose
  "#c9a227", // accent gold
  "#8a6fa8", // mauve
  "#5f8b93", // dusty teal
  "#4b3a3f", // ink
];

type Msg = { name: string; text: string; color: string; ts: number };

const seed: Msg[] = [
  // { name: "Yara", text: "Wishing you a lifetime of love and laughter.", color: colors[2], ts: Date.now() - 7200000 },
  // { name: "Omar", text: "Two beautiful souls, one beautiful future. ✨", color: colors[0], ts: Date.now() - 3600000 },
  // { name: "Lina", text: "So happy for you both — see you soon!", color: colors[3], ts: Date.now() - 1800000 },
];

export function Messages({ onSent }: { onSent?: () => void }) {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [list, setList] = useState<Msg[]>([
    ...store.msg.list().map((m) => ({ name: m.name, text: m.text, color: m.color, ts: m.ts })),
    ...seed,
  ]);

  const send = () => {
    if (!text.trim()) return;
    const finalName = name.trim() || (lang === "en" ? "Guest" : "ضيف");
    const m: Msg = { name: finalName, text: text.trim(), color, ts: Date.now() };
    setList([m, ...list]);
    store.msg.add({ name: finalName, text: m.text, color });
    setName("");
    setText("");
    burstGold();
    onSent?.();
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
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass rounded-2xl p-6 sm:p-8"
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

            {/* Live preview */}
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
              onClick={send}
              disabled={!text.trim()}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("send")}
            </button>
          </motion.div>

          {/* Wall */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {list.map((m, i) => (
                <motion.div
                  key={m.ts + m.name}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-2xl p-5"
                  style={{ animation: `float-soft ${6 + i}s ease-in-out infinite` }}
                >
                  <p
                    className="font-display italic leading-relaxed"
                    style={{ color: m.color, fontSize: "1.15rem" }}
                  >
                    "{m.text}"
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs tracking-wider text-foreground/60">— {m.name}</p>
                    <button
                      className="text-foreground/40 transition-colors hover:text-gold"
                      aria-label="heart"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

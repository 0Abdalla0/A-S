import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { EVENT } from "@/lib/event";

export function IntroEnvelope({ onOpen }: { onOpen: () => void }) {
  const { lang, t } = useLang();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onOpen, 1600);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{ background: "var(--gradient-page)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: opening ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: opening ? 0.8 : 0 }}
      >
        {/* radial glow */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} />

        {/* Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold-soft"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `float-up ${8 + Math.random() * 8}s ${Math.random() * 6}s linear infinite`,
              opacity: 0.6,
            }}
          />
        ))}

        <motion.div
          className="relative flex flex-col items-center px-6"
          animate={opening ? { y: -40, scale: 1.05, opacity: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mb-6 text-xs uppercase tracking-[0.4em] text-gold-soft/80"
          >
            {lang === "en" ? "An Invitation" : "دعوة"}
          </motion.p>

          {/* Envelope */}
          <motion.button
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative aspect-[3/2] w-[min(86vw,420px)] cursor-pointer"
          >
            {/* envelope body */}
            <div className="absolute inset-0 overflow-hidden rounded-md glass-gold shadow-[var(--shadow-elegant)]">
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: "var(--gradient-gold)" }}
              />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="divider-gold w-20" />
                <p className="font-script text-3xl text-gradient-gold leading-none">
                  {EVENT.bride[lang]} & {EVENT.groom[lang]}
                </p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">
                  {lang === "en" ? "Save the Date" : "احفظ الموعد"}
                </p>
                <div className="divider-gold w-20" />
              </div>
            </div>
            {/* envelope flap */}
            <motion.div
              className="absolute -top-px left-0 right-0 origin-top"
              animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d", perspective: 1200 }}
            >
              <div
                className="mx-auto h-0 w-full"
                style={{
                  borderLeft: "calc(min(86vw,420px)/2) solid transparent",
                  borderRight: "calc(min(86vw,420px)/2) solid transparent",
                  borderTop: "calc(min(86vw,420px)/3) solid #f6d5dc",
                  filter: "drop-shadow(0 6px 18px rgba(216,167,177,0.35))",

                }}
              />
            </motion.div>
            {/* wax seal */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
              <div className="flex h-full items-center justify-center font-display text-onyx text-lg italic">L&M</div>
            </div>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-10 text-xs uppercase tracking-[0.35em] text-foreground/50"
          >
            {lang === "en" ? "Tap to open" : "اضغط للفتح"}
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

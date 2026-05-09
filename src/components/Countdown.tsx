import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { EVENT } from "@/lib/event";

function calc(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Cell({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-[clamp(72px,22vw,140px)] aspect-square rounded-2xl glass-gold overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2rem,8vw,4.5rem)] leading-none text-gradient-gold tabular-nums"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gold/20" />
      </div>
      <span className="mt-3 text-[10px] uppercase tracking-[0.35em] text-foreground/60">{label}</span>
    </div>
  );
}

export function Countdown() {
  const { t } = useLang();
  const target = new Date(EVENT.dateISO).getTime();
  const [time, setTime] = useState(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setTime(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {t("countdown")}
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="divider-gold mx-auto mt-4 w-24"
        />

        <div className="mt-14 flex justify-center gap-3 sm:gap-6">
          <Cell value={time.days} label={t("days")} />
          <Cell value={time.hours} label={t("hours")} />
          <Cell value={time.minutes} label={t("minutes")} />
          <Cell value={time.seconds} label={t("seconds")} />
        </div>
      </div>
    </section>
  );
}

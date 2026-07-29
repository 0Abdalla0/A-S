import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import g1 from "@/assets/L&M/1.jpeg";
import g2 from "@/assets/L&M/2.jpeg";
import g3 from "@/assets/L&M/3.jpeg";
import g4 from "@/assets/L&M/4.jpeg";
import g5 from "@/assets/L&M/5.jpeg";
import g6 from "@/assets/L&M/6.jpeg";

const photos = [
  { src: g1, span: "row-span-3" },
  { src: g2, span: "row-span-2" },
  { src: g3, span: "row-span-3" },
  { src: g4, span: "row-span-2" },
  { src: g5, span: "row-span-3" },
  { src: g6, span: "row-span-2" },
];

export function Gallery() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
          >
            {t("gallery")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
          >
            {t("gallerySub")}
          </motion.h2>
        </div>

        <div className="mt-16 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-4">
          {photos.map((p, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.06 }}
              onClick={() => setOpen(p.src)}
              className={`group relative overflow-hidden rounded-xl ${p.span}`}
            >
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/0 transition-all group-hover:ring-gold/40" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-onyx/90 p-6 backdrop-blur-md"
          >
            <motion.img
              src={open}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[88vh] max-w-[92vw] rounded-xl shadow-[var(--shadow-elegant)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

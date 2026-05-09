import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function Story() {
  const { t, lang } = useLang();
  const items = [
    { title: t("story1Title"), body: t("story1Body"), date: t("story1Date") },
    { title: t("story2Title"), body: t("story2Body"), date: t("story2Date") },
    { title: t("story3Title"), body: t("story3Body"), date: t("story3Date") },
  ];

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
          >
            {t("ourStory")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
          >
            {t("storySub")}
          </motion.h2>
        </div>

        <div className="relative mt-20">
          {/* timeline line */}
          <div
            className={`absolute top-0 bottom-0 ${lang === "ar" ? "right-4 sm:right-1/2" : "left-4 sm:left-1/2"}`}
            style={{
              width: "1px",
              background: "linear-gradient(180deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent)",
            }}
          />

          <div className="space-y-14">
            {items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* dot */}
                <div className={`absolute top-2 h-3 w-3 rounded-full bg-gold shadow-[0_0_20px_var(--gold)] ${lang === "ar" ? "right-[10px] sm:right-1/2 sm:-mr-[6px]" : "left-[10px] sm:left-1/2 sm:-ml-[6px]"}`} />

                <div className={`pl-10 sm:w-1/2 sm:px-10 ${lang === "ar" ? "sm:pr-10" : ""}`}>
                  <div className="rounded-2xl glass p-6 transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-gold)]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold-soft/80">{it.date}</p>
                    <h3 className="mt-2 font-display text-2xl italic text-ivory">{it.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{it.body}</p>
                  </div>
                </div>
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

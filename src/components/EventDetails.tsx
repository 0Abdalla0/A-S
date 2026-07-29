import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { EVENT } from "@/lib/event";

export function EventDetails() {
  const { t, lang } = useLang();

  const date = new Date(EVENT.dateISO);

  const dateStr = date.toLocaleDateString(
    lang === "ar" ? "ar-EG" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const timeStr = date.toLocaleTimeString(
    lang === "ar" ? "ar-EG" : "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  const calendarUrl = (() => {
    const start = date
      .toISOString()
      .replace(/[-:]|\.\d{3}/g, "");

    const end = new Date(date.getTime() + 4 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]|\.\d{3}/g, "");

    const text = encodeURIComponent(
      `${EVENT.bride.en} & ${EVENT.groom.en} — Wedding`
    );

    const loc = encodeURIComponent(EVENT.venue.address.en);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&location=${loc}`;
  })();

  // Google Maps Embed URL
  const mapsEmbed =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8751265589262!2d31.308391599999997!3d30.0746519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e4ac7f989d1%3A0x99bb199a31583c34!2sArmor%20Officers%20House!5e1!3m2!1sen!2seg!4v1785320768647!5m2!1sen!2seg";

  // Opens Google Maps in a new tab
  const directionsUrl =
    "https://maps.google.com/?q=Armor+Officers+House+Cairo";

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
            {t("details")}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
          >
            {t("detailsSub")}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {/* Details Card */}
          <div className="glass rounded-2xl p-8 sm:p-10">
            <div className="space-y-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold-soft/80">
                  {lang === "en" ? "When" : "متى"}
                </p>

                <p className="mt-2 font-display text-2xl italic text-ivory">
                  {dateStr}
                </p>

                <p className="mt-1 text-sm text-foreground/60">
                  {timeStr}
                </p>
              </div>

              <div className="divider-gold" />

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold-soft/80">
                  {lang === "en" ? "Where" : "أين"}
                </p>

                <p className="mt-2 font-display text-2xl italic text-ivory">
                  {EVENT.venue.name[lang]}
                </p>

                <p className="mt-1 text-sm text-foreground/60">
                  {EVENT.venue.address[lang]}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="gold-border inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-gold transition-all hover:bg-gold/10"
                >
                  {t("addCalendar")}
                </a>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-deep to-gold px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-onyx shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
                >
                  {t("directions")}
                </a>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="overflow-hidden rounded-2xl glass">
            <iframe
              src={mapsEmbed}
              title="Wedding Venue Location"
              className="w-full h-[450px]"
              style={{
                border: 0,
                filter:
                  "grayscale(0.4) contrast(0.95) brightness(0.85)",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

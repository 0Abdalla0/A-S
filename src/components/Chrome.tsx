import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="fixed top-5 right-5 z-50 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold transition-all hover:scale-105 hover:shadow-[var(--shadow-gold)] sm:top-7 sm:right-7"
    >
      {t("language")}
    </button>
  );
}

export function FloatingRSVP() {
  const { t } = useLang();
  return (
    <a
      href="#rsvp"
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-deep to-gold px-7 py-3 text-xs uppercase tracking-[0.35em] text-onyx shadow-[var(--shadow-gold)] transition-transform hover:scale-105 sm:bottom-7"
      style={{ animation: "pulse-gold 3s infinite" }}
    >
      {t("rsvpFloat")}
    </a>
  );
}

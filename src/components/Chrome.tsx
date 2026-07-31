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

export function FloatingInstagram() {
  return (
    <a
      href="https://www.instagram.com/invitra.eg"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5Zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4Zm9.25 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    </a>
  );
}

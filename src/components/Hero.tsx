import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { EVENT } from "@/lib/event";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  const { lang, t } = useLang();

  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const date = new Date(EVENT.dateISO);

  const dateStr = date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      try {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
        setMusicOn(true);
      } catch (err) {
        console.error("Unable to play audio:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Hidden Audio */}
      <audio ref={audioRef} src="/music/our-song.mp3" loop preload="auto" />

      {/* BG image with parallax-like fade */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-[0.18]"
          style={{
            filter: "saturate(0.55) brightness(1.35) sepia(0.15)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,249,250,0.35) 0%, var(--onyx) 78%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "var(--gradient-radial-glow)",
          }}
        />
      </div>

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-soft"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `float-up ${
                12 + Math.random() * 12
              }s ${Math.random() * 10}s linear infinite`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-8 text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {t("weAre")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.6,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-[clamp(3rem,12vw,7.5rem)] leading-[0.95] text-gradient-gold"
        >
          {EVENT.bride[lang]}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.1 }}
          className="my-3 flex items-center gap-4"
        >
          <span className="block h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <span className="font-script text-3xl text-gold-soft">&</span>
          <span className="block h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.6,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-[clamp(3rem,12vw,7.5rem)] leading-[0.95] text-gradient-gold"
        >
          {EVENT.groom[lang]}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-foreground/60">
            {t("saveDate")}
          </p>

          <p className="font-display text-xl italic text-ivory/90 sm:text-2xl">{dateStr}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-foreground/50">
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.4em]">scroll</span>
          </div>
        </motion.div>
      </div>

      {/* Music Toggle */}
      <button
        onClick={toggleMusic}
        className="absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full glass text-gold transition-transform hover:scale-110 sm:bottom-8 sm:right-8"
        aria-label={t("music")}
      >
        {musicOn ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        )}
      </button>
    </section>
  );
}

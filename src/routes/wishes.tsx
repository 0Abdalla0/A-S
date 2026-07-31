import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LangProvider, useLang } from "@/lib/i18n";
import { InvitationDataProvider, useInvitationData, type MsgEntry } from "@/lib/invitation-data";
import { EVENT } from "@/lib/event";
import { motion, AnimatePresence } from "framer-motion";
import { LangToggle } from "@/components/Chrome";

export const Route = createFileRoute("/wishes")({
  head: () => ({
    meta: [
      { title: `Wishes · ${EVENT.bride.en} & ${EVENT.groom.en}` },
      {
        name: "description",
        content: `Read the warm wishes left by loved ones for ${EVENT.bride.en} & ${EVENT.groom.en}.`,
      },
    ],
  }),
  component: WishesPage,
});

function WishesPage() {
  return (
    <LangProvider>
      <InvitationDataProvider>
        <WishesList />
      </InvitationDataProvider>
    </LangProvider>
  );
}

function WishesList() {
  const { lang, t } = useLang();
  const { msgs, loading, ready } = useInvitationData();
  const [selectedMsg, setSelectedMsg] = useState<MsgEntry | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedMsg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMsg]);

  return (
    <>
      <LangToggle />
      <main className="min-h-screen px-6 py-12 relative">
        {/* Background Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-radial-glow)", opacity: 0.7 }}
        />

        <div className="mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center relative">
            <Link
              to="/"
              className="absolute left-0 top-0 sm:top-2 rounded-full glass px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-foreground/70 hover:text-gold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                {lang === "ar" ? (
                  <path d="M5 12h14M12 5l7 7-7 7" />
                ) : (
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                )}
              </svg>
              <span>{lang === "en" ? "Back" : "العودة"}</span>
            </Link>

            <p className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80 mt-12 sm:mt-0">
              {lang === "en" ? "Wishes from Loved Ones" : "كلمات من الأحبّة"}
            </p>
            <h1 className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-6xl">
              {EVENT.bride[lang]} & {EVENT.groom[lang]}
            </h1>
            <div className="divider-gold mx-auto w-32 mt-6" />
          </div>

          {/* Grid List */}
          <div className="mt-16">
            {loading && !ready ? (
              <div className="text-center py-20">
                <p className="text-sm text-foreground/60 uppercase tracking-[0.2em] animate-pulse">
                  {lang === "en" ? "Loading wishes..." : "جاري تحميل التهاني..."}
                </p>
              </div>
            ) : msgs.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl p-10">
                <p className="text-sm text-foreground/50">
                  {lang === "en" ? "No wishes here yet." : "لا توجد تهاني هنا بعد."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {msgs.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.05, 1) }}
                    onClick={() => setSelectedMsg(m)}
                    className="glass rounded-2xl p-5 cursor-pointer hover-lift relative flex flex-col justify-between h-[180px] group transition-all"
                  >
                    <p
                      className="font-display italic line-clamp-4 leading-relaxed text-sm group-hover:text-gold transition-colors"
                      style={{ color: m.color }}
                    >
                      "{m.text}"
                    </p>
                    <div className="mt-4 border-t border-border/20 pt-2 flex items-center justify-between">
                      <p className="text-xs text-foreground/60 truncate font-semibold">{m.name}</p>
                      <span className="text-[10px] text-foreground/40 font-mono">
                        {new Date(m.ts).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Full-view Modal */}
      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/85 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md cursor-pointer"
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl sm:rounded-3xl glass-gold p-8 sm:p-12 text-center cursor-default animate-fade-up max-h-[90vh] sm:max-h-[80vh] flex flex-col justify-center overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMsg(null)}
                className="absolute top-4 right-4 rounded-full bg-foreground/10 p-2 text-foreground/80 hover:text-foreground hover:bg-foreground/20 cursor-pointer transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="my-auto py-6">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mx-auto text-gold-soft/40 mb-6"
                >
                  <path
                    d="M11.19 12c0 2.2-1.79 4-4 4s-4-1.8-4-4c0-2.2 2-6 6-8l.5 1.5c-2.5 1.5-2.5 3-2.5 3.5.5-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4zm9 0c0 2.2-1.79 4-4 4s-4-1.8-4-4c0-2.2 2-6 6-8l.5 1.5c-2.5 1.5-2.5 3-2.5 3.5.5-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4z"
                    fill="currentColor"
                  />
                </svg>

                <p
                  className="font-display italic text-2xl sm:text-4xl leading-relaxed text-gradient-gold px-2 font-light"
                  style={{ color: selectedMsg.color }}
                >
                  {selectedMsg.text}
                </p>

                <div className="divider-gold mx-auto w-24 my-8" />

                <p className="font-script text-3xl text-gradient-gold">{selectedMsg.name}</p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-mono">
                  {new Date(selectedMsg.ts).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

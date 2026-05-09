import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { store } from "@/lib/store";
import { burstGold } from "@/lib/confetti";

export function VoiceNote({ onSent }: { onSent?: () => void }) {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    stream.current?.getTracks().forEach((tr) => tr.stop());
  }, []);

  const start = async () => {
    setError(null);
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream.current);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(blob);
        setDuration(elapsed);
        stream.current?.getTracks().forEach((tr) => tr.stop());
      };
      rec.start();
      recorder.current = rec;
      setRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError(lang === "en" ? "Microphone access denied." : "تم رفض الوصول للميكروفون.");
    }
  };

  const stop = () => {
    recorder.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const save = () => {
    if (!preview) return;
    store.voice.add({ name: name.trim() || (lang === "en" ? "Guest" : "ضيف"), dataUrl: preview, duration });
    burstGold();
    onSent?.();
    setPreview(null); setName(""); setElapsed(0); setDuration(0);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section id="voice" className="relative px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {lang === "en" ? "Voice from the heart" : "صوت من القلب"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
        >
          {lang === "en" ? "Record a wish in your voice" : "سجّل أمنيتك بصوتك"}
        </motion.h2>

        <div className="mt-10 glass-gold rounded-3xl p-8">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t("yourName")}
            className="w-full rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none placeholder:text-foreground/40 focus:border-gold/60" />

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={recording ? stop : start}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${recording ? "bg-destructive/30" : "bg-gradient-to-br from-gold-deep to-gold"}`}
              style={{ animation: recording ? "pulse-gold 1.2s infinite" : undefined }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={recording ? "#fff" : "#1a1410"} strokeWidth="1.8">
                {recording ? (
                  <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
                ) : (
                  <>
                    <rect x="9" y="3" width="6" height="12" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </>
                )}
              </svg>
            </button>
            <p className="mt-4 font-display text-2xl text-gradient-gold">{fmt(elapsed)}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              {recording ? (lang === "en" ? "Recording…" : "جاري التسجيل…") : (lang === "en" ? "Tap to record" : "اضغط للتسجيل")}
            </p>
            {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
          </div>

          {preview && (
            <div className="mt-6 rounded-xl border border-gold/30 bg-onyx/40 p-4">
              <audio src={preview} controls className="w-full" />
              <button onClick={save}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] hover:scale-[1.02] transition-transform">
                {lang === "en" ? "Send Voice Note" : "أرسل المقطع"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

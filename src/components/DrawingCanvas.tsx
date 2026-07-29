import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { store } from "@/lib/store";
import { burstGold } from "@/lib/confetti";

const palette = ["#b06a7c", "#d8a7b1", "#c9a227", "#8e4c5f", "#a89bc4", "#7fa8ac"];

export function DrawingCanvas({ onSent }: { onSent?: () => void }) {
  const { t, lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(palette[0]);
  const [size, setSize] = useState(3);
  const [name, setName] = useState("");
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(255,255,255,1)";

    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    last.current = pos(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.shadowColor = "rgba(216,167,177,0.35)";
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const r = canvas.getBoundingClientRect();
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, r.width, r.height);
  };

  const save = () => {
    const dataUrl = canvasRef.current!.toDataURL("image/png");
    store.draw.add({ name: name.trim() || (lang === "en" ? "Guest" : "ضيف"), dataUrl });
    burstGold();
    onSent?.();
    clear();
    setName("");
  };

  return (
    <section id="draw" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {lang === "en" ? "Sketch a wish" : "ارسم أمنية"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-5xl"
        >
          {lang === "en" ? "Draw us something beautiful" : "ارسم لنا شيئًا جميلًا"}
        </motion.h2>

        <div className="mt-10 glass-gold rounded-3xl p-4 sm:p-6">
          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="h-[320px] w-full touch-none rounded-2xl border border-gold/30 sm:h-[420px]"
            style={{ background: "#ffffff" }}
          />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {palette.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border border-border transition-transform hover:scale-110 ${color === c ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""}`}
                style={{ background: c }}
                aria-label="color"
              />
            ))}
            <input
              type="range"
              min={1}
              max={12}
              value={size}
              onChange={(e) => setSize(+e.target.value)}
              className="ml-2 accent-[#b06a7c]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className="flex-1 rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-ivory outline-none placeholder:text-foreground/40 focus:border-gold/60"
            />
            <button
              onClick={clear}
              className="rounded-full glass px-5 py-3 text-xs uppercase tracking-[0.3em] text-foreground/70 hover:text-gold"
            >
              {lang === "en" ? "Clear" : "مسح"}
            </button>
            <button
              onClick={save}
              className="rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] hover:scale-[1.02] transition-transform"
            >
              {lang === "en" ? "Save Sketch" : "احفظ الرسمة"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

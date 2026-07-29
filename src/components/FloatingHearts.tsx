import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingHearts({ trigger }: { trigger: number }) {
  const [bursts, setBursts] = useState<number[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const id = Date.now();
      setBursts((b) => [...b, id]);
      setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 3500);
    }
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      <AnimatePresence>
        {bursts.map((id) => (
          <BurstSet key={id} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function BurstSet() {
  const hearts = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 60,
    delay: Math.random() * 0.4,
    size: 14 + Math.random() * 22,
    drift: (Math.random() - 0.5) * 30,
  }));
  return (
    <>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, y: "100vh", x: `${h.x}vw`, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], y: "-10vh", x: `${h.x + h.drift}vw`, scale: 1, rotate: h.drift }}
          transition={{ duration: 3, delay: h.delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{ width: h.size, height: h.size }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <defs>
              <linearGradient id={`g${h.id}`} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f6d5dc" />
                <stop offset="100%" stopColor="#c98f9c" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={`url(#g${h.id})`}
              style={{ filter: "drop-shadow(0 6px 14px rgba(216,167,177,0.45))" }}

            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

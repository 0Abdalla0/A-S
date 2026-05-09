import confetti from "canvas-confetti";

const gold = ["#d4af37", "#f5e6a8", "#b8860b", "#fff8dc", "#e6c878"];

export function burstGold() {
  if (typeof window === "undefined") return;
  const end = Date.now() + 1200;
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: gold,
      scalar: 1.1,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors: gold,
      scalar: 1.1,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: gold,
    shapes: ["circle", "square"],
    scalar: 1.2,
  });
}

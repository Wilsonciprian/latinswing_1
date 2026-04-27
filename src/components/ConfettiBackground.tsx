import { useMemo } from "react";

const COLORS = [
  "hsl(var(--confetti-1))",
  "hsl(var(--confetti-2))",
  "hsl(var(--confetti-3))",
  "hsl(var(--confetti-4))",
  "hsl(var(--confetti-5))",
];

const SHAPES = ["circle", "square", "rect"] as const;

type Particle = {
  left: string;
  size: number;
  color: string;
  shape: (typeof SHAPES)[number];
  delay: string;
  duration: string;
  drift: string;
};

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    // Deterministic-ish pseudo-random based on index for stable SSR/CSR
    const r = (n: number) => Math.abs(Math.sin((i + 1) * n)) % 1;
    return {
      left: `${(r(12.9898) * 100).toFixed(2)}%`,
      size: 6 + Math.round(r(78.233) * 8),
      color: COLORS[Math.floor(r(43.123) * COLORS.length)],
      shape: SHAPES[Math.floor(r(91.345) * SHAPES.length)],
      delay: `${(r(33.77) * 18).toFixed(2)}s`,
      duration: `${(14 + r(56.21) * 14).toFixed(2)}s`,
      drift: `${Math.round((r(99.1) - 0.5) * 80)}px`,
    };
  });
}

const ConfettiBackground = () => {
  const particles = useMemo(() => buildParticles(36), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--gradient-warm)" }}
    >
      {particles.map((p, i) => {
        const radius =
          p.shape === "circle" ? "9999px" : p.shape === "rect" ? "2px" : "3px";
        const w = p.shape === "rect" ? p.size * 1.6 : p.size;
        const h = p.shape === "rect" ? p.size * 0.5 : p.size;
        return (
          <span
            key={i}
            className="absolute top-0 block"
            style={{
              left: p.left,
              width: `${w}px`,
              height: `${h}px`,
              backgroundColor: p.color,
              borderRadius: radius,
              opacity: 0.55,
              animation: `confetti-drift ${p.duration} linear ${p.delay} infinite`,
              ["--drift" as never]: p.drift,
            }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiBackground;

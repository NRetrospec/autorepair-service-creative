import { useMemo } from "react";

// Lightweight floating particle field (CSS-only, GPU friendly)
export default function Particles({ count = 22, color = "#c7ccd4" }: { count?: number; color?: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 8 + Math.random() * 10,
        size: 1 + Math.random() * 2.5,
        op: 0.15 + Math.random() * 0.4,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            background: color,
            opacity: d.op,
            animation: `float-up ${d.dur}s ${d.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

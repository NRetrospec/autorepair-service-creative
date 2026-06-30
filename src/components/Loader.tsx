import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [rpm, setRpm] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease with a little redline overshoot
      const eased = p < 0.85 ? p / 0.85 : 1 - (p - 0.85) * 0.4;
      setRpm(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const angle = -120 + rpm * 240; // -120 to +120 deg
  const ticks = Array.from({ length: 9 });

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center carbon"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 w-64">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <radialGradient id="gauge" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#0e0f12" />
              <stop offset="100%" stopColor="#1c2027" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="92" fill="url(#gauge)" stroke="#2a2f38" strokeWidth="3" />
          {ticks.map((_, i) => {
            const a = (-120 + (i / 8) * 240) * (Math.PI / 180);
            const redline = i >= 7;
            const r1 = 78,
              r2 = i % 2 === 0 ? 64 : 70;
            return (
              <g key={i}>
                <line
                  x1={100 + Math.cos(a) * r1}
                  y1={100 + Math.sin(a) * r1}
                  x2={100 + Math.cos(a) * r2}
                  y2={100 + Math.sin(a) * r2}
                  stroke={redline ? "#e10600" : "#c7ccd4"}
                  strokeWidth={i % 2 === 0 ? 3 : 1.5}
                />
                {i % 2 === 0 && (
                  <text
                    x={100 + Math.cos(a) * 52}
                    y={100 + Math.sin(a) * 52 + 4}
                    fill={redline ? "#e10600" : "#8b929c"}
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="Sora"
                  >
                    {i}
                  </text>
                )}
              </g>
            );
          })}
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="30" stroke="#e10600" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="100" y1="100" x2="100" y2="118" stroke="#e10600" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <circle cx="100" cy="100" r="9" fill="#e8ebf0" />
          <circle cx="100" cy="100" r="4" fill="#e10600" />
        </svg>
      </div>
      <div className="mt-6 text-center">
        <div className="font-display text-3xl font-extrabold tracking-[0.3em] chrome-text">APEX</div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.4em] text-zinc-500">Auto Werks · Engineering Start-up</div>
      </div>
      <div className="mt-5 h-1 w-56 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-amber-400"
          style={{ width: `${rpm * 100}%` }}
        />
      </div>
    </motion.div>
  );
}

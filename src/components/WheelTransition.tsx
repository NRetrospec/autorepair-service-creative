import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* ───────────────────────────────────────────────────────────
   Realistic rolling-wheel page transition.
   A chrome/carbon wheel rolls across the screen, wiping the old
   page away with a dark panel + tire smoke + brake dust + tread
   marks, then reveals the next section behind it.
   ─────────────────────────────────────────────────────────── */

function Wheel({ size = 260 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className="drop-shadow-[0_25px_45px_rgba(0,0,0,0.7)]">
      <defs>
        <radialGradient id="tireG" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#2a2d33" />
          <stop offset="70%" stopColor="#121316" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <radialGradient id="rimG" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fbfcfe" />
          <stop offset="35%" stopColor="#cfd4dc" />
          <stop offset="60%" stopColor="#6a6f78" />
          <stop offset="100%" stopColor="#2a2d33" />
        </radialGradient>
        <radialGradient id="hubG" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#e8ebf0" />
          <stop offset="100%" stopColor="#3a3e46" />
        </radialGradient>
        <linearGradient id="spokeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f4f7" />
          <stop offset="50%" stopColor="#9aa0aa" />
          <stop offset="100%" stopColor="#4a4e56" />
        </linearGradient>
      </defs>

      {/* Tire */}
      <circle cx="100" cy="100" r="98" fill="url(#tireG)" />
      {/* Tread */}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        const x1 = 100 + Math.cos(a) * 92;
        const y1 = 100 + Math.sin(a) * 92;
        const x2 = 100 + Math.cos(a) * 99;
        const y2 = 100 + Math.sin(a) * 99;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="3" opacity="0.55" />;
      })}
      <circle cx="100" cy="100" r="84" fill="none" stroke="#000" strokeWidth="2" opacity="0.6" />

      {/* Red brake caliper hint */}
      <circle cx="100" cy="100" r="70" fill="#0c0d10" />
      <path d="M 158 78 A 64 64 0 0 1 158 122 L 150 118 A 56 56 0 0 0 150 82 Z" fill="#e10600" opacity="0.85" />

      {/* Rim */}
      <circle cx="100" cy="100" r="66" fill="url(#rimG)" />
      <circle cx="100" cy="100" r="60" fill="#16181c" />

      {/* Spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * 360;
        return (
          <g key={i} transform={`rotate(${a} 100 100)`}>
            <path d="M 100 100 L 90 44 Q 100 38 110 44 Z" fill="url(#spokeG)" />
          </g>
        );
      })}

      {/* Hub */}
      <circle cx="100" cy="100" r="22" fill="url(#hubG)" />
      <circle cx="100" cy="100" r="22" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={100 + Math.cos(a) * 12} cy={100 + Math.sin(a) * 12} r="2.4" fill="#22252b" />;
      })}
      <circle cx="100" cy="100" r="5" fill="#e10600" />
      {/* chrome glint */}
      <ellipse cx="84" cy="80" rx="14" ry="22" fill="#fff" opacity="0.18" />
    </svg>
  );
}

export default function WheelTransition({ active, onMidpoint }: { active: boolean; onMidpoint: () => void }) {
  const [firedMid, setFiredMid] = useState(false);

  useEffect(() => {
    if (active) setFiredMid(false);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Dark wipe panel that the wheel drags in */}
          <motion.div
            className="absolute inset-0 carbon"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
            onUpdate={(latest) => {
              const xv = typeof latest.x === "string" ? parseFloat(latest.x) : (latest.x as number);
              if (!firedMid && xv > -8) {
                setFiredMid(true);
                onMidpoint();
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-red-900/20" />
          </motion.div>

          {/* Tire smoke trail */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[340px] w-[60%]"
            initial={{ x: "-60%", opacity: 0 }}
            animate={{ x: "70%", opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{
              background: "radial-gradient(ellipse at left, rgba(180,180,190,0.5), transparent 60%)",
              filter: "blur(24px)",
            }}
          />

          {/* Brake dust particles */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute top-1/2 h-1.5 w-1.5 rounded-full"
              style={{ background: i % 3 === 0 ? "#e10600" : "#c7ccd4" }}
              initial={{ x: "-10vw", y: 0, opacity: 0 }}
              animate={{
                x: ["-10vw", "60vw"],
                y: [0, (i % 2 ? -1 : 1) * (30 + i * 8)],
                opacity: [0, 0.9, 0],
                scale: [1, 0.4],
              }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.015, ease: "easeOut" }}
            />
          ))}

          {/* The rolling wheel with suspension bounce + motion blur */}
          <motion.div
            className="absolute top-1/2 will-change-transform"
            initial={{ left: "-30vw", rotate: 0 }}
            animate={{
              left: ["-30vw", "44vw", "120vw"],
              rotate: [0, 720, 1500],
              y: ["-50%", "-54%", "-46%", "-50%"],
            }}
            transition={{
              left: { duration: 0.85, ease: [0.6, 0, 0.4, 1] },
              rotate: { duration: 0.85, ease: "easeIn" },
              y: { duration: 0.85, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
            }}
          >
            <motion.div
              animate={{ filter: ["blur(0px)", "blur(3px)", "blur(0px)"] }}
              transition={{ duration: 0.85, times: [0, 0.5, 1] }}
            >
              <Wheel />
            </motion.div>
          </motion.div>

          {/* Tread mark on the "ground" */}
          <motion.div
            className="absolute top-1/2 left-0 h-3 bg-black/40"
            style={{ marginTop: 120 }}
            initial={{ width: 0, opacity: 0.5 }}
            animate={{ width: "120vw", opacity: [0.5, 0.3, 0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Btn({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "amber" | "blue";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all sheen disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-gradient-to-br from-red-600 to-red-700 text-white glow-red hover:from-red-500 hover:to-red-600",
    amber: "bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:brightness-110",
    blue: "bg-gradient-to-br from-sky-400 to-blue-600 text-white glow-blue hover:brightness-110",
    ghost: "glass text-zinc-100 hover:border-white/25 hover:bg-white/5",
  };
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.04, y: disabled ? 0 : -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, styles[variant], className)}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children, dot = "#e10600" }: { children: ReactNode; dot?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full glass-light px-3.5 py-1.5 text-xs font-medium text-zinc-200">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3">
      <span className="h-px w-10 bg-gradient-to-r from-red-600 to-transparent" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-red-500">{children}</span>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tachometer-style circular progress
export function Tach({ value, max = 100, label, suffix = "" }: { value: number; max?: number; label: string; suffix?: string }) {
  const pct = Math.min(1, value / max);
  const circ = 2 * Math.PI * 42;
  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#22252b" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#tg)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb020" />
            <stop offset="100%" stopColor="#e10600" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-9 text-center">
        <div className="font-display text-xl font-bold text-white">
          {value}
          {suffix}
        </div>
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-400">{label}</div>
    </div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <CountUp to={to} suffix={suffix} />
    </motion.span>
  );
}

import { useEffect, useRef, useState } from "react";
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1500;
          const start = performance.now();
          const dec = to % 1 !== 0;
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(dec ? +(to * eased).toFixed(1) : Math.round(to * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

import { motion } from "framer-motion";
import { BRAND } from "../data/content";
import { Btn } from "../components/ui";
import Particles from "../components/Particles";

const badges = ["ASE Certified", "Family Owned", "Same-Day Repairs", "Warranty Included", "Financing Available"];

function Gear({ size, className, dur = 16, reverse }: { size: number; className?: string; dur?: number; reverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ animation: `spin-slow ${dur}s linear infinite ${reverse ? "reverse" : ""}` }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="46" y="2" width="8" height="16" rx="2" fill="currentColor" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="8" />
      <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
  );
}

export default function Hero({ go }: { go: (id: string) => void }) {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden carbon">
      {/* Cinematic garage lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[60vh] w-[60vh] rounded-full bg-red-700/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[55vh] w-[55vh] rounded-full bg-sky-600/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/4 h-[40vh] w-[80vw] -translate-x-1/2 bg-amber-500/[0.06] blur-[100px]" />
        {/* light sweep */}
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
          animate={{ left: ["-30%", "130%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Rotating gears decoration */}
      <div className="pointer-events-none absolute right-[6%] top-[14%] text-zinc-700/40">
        <Gear size={120} dur={22} />
      </div>
      <div className="pointer-events-none absolute right-[2%] top-[26%] text-zinc-600/40">
        <Gear size={70} dur={12} reverse />
      </div>
      <div className="pointer-events-none absolute left-[4%] bottom-[12%] text-zinc-700/30">
        <Gear size={90} dur={18} reverse />
      </div>

      <Particles count={26} />
      {/* floor grid */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          background:
            "linear-gradient(transparent, rgba(225,6,0,0.04)), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 60px)",
          transform: "perspective(400px) rotateX(60deg)",
          transformOrigin: "bottom",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-3.5 py-1.5 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Now booking · {BRAND.address.split(",")[1]}
          </span>
          <span className="text-xs text-zinc-500">ASE Master Certified · Est. 1998</span>
        </motion.div>

        <h1 className="font-display text-[12vw] font-extrabold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="block chrome-text text-shadow-lg"
          >
            Precision Repairs.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="block"
          >
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-amber-400 bg-clip-text text-transparent">
              Performance
            </span>{" "}
            <span className="metal-text">You Can Trust.</span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          From daily drivers to supercars — {BRAND.full} engineers every repair with dealer-grade tooling,
          transparent pricing, and a nationwide warranty. Drop the key, trust the craft.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Btn onClick={() => go("booking")}>Schedule Service →</Btn>
          <Btn variant="ghost" onClick={() => go("services")}>
            Request Estimate
          </Btn>
          <Btn variant="amber" onClick={() => go("contact")} className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
            </span>
            Emergency Repair
          </Btn>
        </motion.div>

        {/* floating trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap gap-2.5"
        >
          {badges.map((b, i) => (
            <motion.span
              key={b}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl glass-light px-3.5 py-2 text-xs font-medium text-zinc-300"
            >
              ✓ {b}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.button
        onClick={() => go("services")}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-500"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Shift Down</span>
        <span className="text-lg">▾</span>
      </motion.button>
    </section>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { GALLERY } from "../data/content";
import { SectionLabel, Reveal } from "../components/ui";

const CATS = ["All", "Performance", "Luxury", "Daily", "Restoration"] as const;

function CarCard({ v }: { v: (typeof GALLERY)[number] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10"
    >
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${v.hue} carbon`}>
        <div className="absolute inset-0 grid place-items-center">
          {/* stylized car silhouette */}
          <svg viewBox="0 0 200 90" className="w-3/4 opacity-80 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
            <path
              d="M15 62 Q20 44 48 42 L70 42 Q82 28 110 28 L140 30 Q160 32 172 46 L186 50 Q192 54 188 62 L178 64 A12 12 0 0 0 152 64 L70 64 A12 12 0 0 0 44 64 L18 64 Q12 64 15 62Z"
              fill="url(#carbody)"
            />
            <defs>
              <linearGradient id="carbody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8ebf0" />
                <stop offset="100%" stopColor="#5a5f68" />
              </linearGradient>
            </defs>
            <path d="M80 42 L108 32 L134 34 L142 42 Z" fill="#0a0b0d" opacity="0.7" />
            <circle cx="57" cy="66" r="13" fill="#0a0b0d" />
            <circle cx="57" cy="66" r="6" fill="#c7ccd4" />
            <circle cx="163" cy="66" r="13" fill="#0a0b0d" />
            <circle cx="163" cy="66" r="6" fill="#c7ccd4" />
          </svg>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur">
          {v.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-red-600/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          360°
        </span>
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs text-zinc-300">🔧 {v.work}</p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gunmetal/60 px-4 py-3">
        <span className="font-display text-sm font-bold text-white">{v.name}</span>
        <span className="text-[10px] text-zinc-500">View build →</span>
      </div>
    </motion.div>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b) return;
    setPos(Math.max(0, Math.min(100, ((clientX - b.left) / b.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10"
      onMouseMove={(e) => e.buttons === 1 && drag(e.clientX)}
      onClick={(e) => drag(e.clientX)}
      onTouchMove={(e) => drag(e.touches[0].clientX)}
    >
      {/* After (full) */}
      <div className="absolute inset-0 carbon">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 to-sky-700/10" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-2xl font-bold text-emerald-300">AFTER · Restored</span>
        </div>
      </div>
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="carbon h-full w-screen max-w-none">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-zinc-900/40" style={{ filter: "grayscale(0.6) brightness(0.6)" }} />
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-display text-2xl font-bold text-zinc-500">BEFORE · Damaged</span>
          </div>
        </div>
      </div>
      {/* Handle */}
      <div className="absolute inset-y-0 z-10 flex items-center" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="h-full w-0.5 bg-white/80" />
        <div className="absolute grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-lg">⇄</div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = cat === "All" ? GALLERY : GALLERY.filter((v) => v.category === cat);
  return (
    <section className="relative min-h-screen overflow-hidden bg-matte section-pad">
      <div className="pointer-events-none absolute left-0 top-1/4 h-80 w-80 rounded-full bg-sky-700/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>The Build Book</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              <span className="chrome-text">Work that</span> <span className="text-red-500">speaks.</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    cat === c ? "bg-red-600 text-white glow-red" : "glass-light text-zinc-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((v) => (
              <CarCard key={v.id} v={v} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Before / After</span>
              <span className="text-xs text-zinc-600">— drag to compare</span>
            </div>
            <BeforeAfter />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

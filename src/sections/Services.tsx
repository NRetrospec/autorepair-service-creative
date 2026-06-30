import { motion } from "framer-motion";
import { useState } from "react";
import { SERVICES } from "../data/content";
import { SectionLabel, Reveal, Btn } from "../components/ui";

const accentMap: Record<string, string> = {
  racing: "from-red-600/20 to-red-900/5 group-hover:border-red-500/50",
  electric: "from-sky-500/20 to-blue-900/5 group-hover:border-sky-400/50",
  amber: "from-amber-400/20 to-amber-900/5 group-hover:border-amber-400/50",
  silver: "from-zinc-300/15 to-zinc-700/5 group-hover:border-zinc-300/40",
};
const dotMap: Record<string, string> = {
  racing: "#e10600",
  electric: "#18c8ff",
  amber: "#ffb020",
  silver: "#c7ccd4",
};

function Card({ s, go }: { s: (typeof SERVICES)[number]; go: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const [r, setR] = useState({ x: 0, y: 0 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    setR({ x: -py * 12, y: px * 12 });
  };

  return (
    <motion.div
      onMouseMove={move}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setR({ x: 0, y: 0 });
      }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className="group relative"
    >
      <motion.div
        animate={{ rotateX: r.x, rotateY: r.y, z: hover ? 40 : 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className={`relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accentMap[s.accent]} p-5 transition-colors`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 brushed opacity-30" />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start justify-between">
            <motion.div
              animate={hover ? { rotate: [0, -10, 10, 0], scale: 1.15 } : {}}
              transition={{ duration: 0.6 }}
              className="grid h-12 w-12 place-items-center rounded-xl bg-black/40 text-2xl ring-1 ring-white/10"
            >
              {s.icon}
            </motion.div>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ background: dotMap[s.accent] + "22", color: dotMap[s.accent] }}
            >
              {s.price}
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-white">{s.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{s.blurb}</p>

          <motion.div
            initial={false}
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-xs leading-relaxed text-zinc-400">{s.detail}</p>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[11px] text-zinc-500">⏱ Avg. {s.time}</span>
              <button onClick={() => go("booking")} className="text-[11px] font-semibold text-white underline-offset-2 hover:underline">
                Book →
              </button>
            </div>
          </motion.div>
        </div>
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100"
          style={{ background: dotMap[s.accent], opacity: hover ? 0.25 : 0 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Services({ go }: { go: (id: string) => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-matte section-pad">
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-red-700/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>The Garage Menu</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              <span className="chrome-text">Every system.</span>{" "}
              <span className="text-zinc-500">Engineered to spec.</span>
            </h2>
            <Btn variant="ghost" onClick={() => go("booking")}>
              Build an Estimate →
            </Btn>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 0.06}>
              <Card s={s} go={go} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

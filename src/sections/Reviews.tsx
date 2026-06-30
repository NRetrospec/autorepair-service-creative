import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { REVIEWS } from "../data/content";
import { SectionLabel, Reveal } from "../components/ui";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-amber-400" : "text-zinc-700"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const next = () => {
    setDir(1);
    setI((p) => (p + 1) % REVIEWS.length);
  };
  const prev = () => {
    setDir(-1);
    setI((p) => (p - 1 + REVIEWS.length) % REVIEWS.length);
  };
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);
  const r = REVIEWS[i];

  return (
    <section className="relative min-h-screen overflow-hidden carbon section-pad">
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Verified Reviews</SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              <span className="metal-text">Trusted by</span> <span className="text-red-500">drivers.</span>
            </h2>
            <div className="flex items-center gap-3 rounded-full glass px-4 py-2">
              <span className="font-display text-2xl font-bold text-amber-400">4.9</span>
              <div>
                <Stars n={5} />
                <span className="text-[10px] text-zinc-500">2,400+ Google reviews</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.4fr,1fr]">
          {/* Main carousel */}
          <Reveal>
            <div className="relative h-[340px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={i}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 60, rotateY: dir * 10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -dir * 60, rotateY: -dir * 10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col justify-between rounded-3xl glass p-8"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <Stars n={r.rating} />
                      <span className="text-5xl text-red-600/30">"</span>
                    </div>
                    <p className="font-display text-xl font-medium leading-relaxed text-zinc-100 md:text-2xl">
                      {r.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${r.hue} font-bold text-white`}>
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{r.name}</div>
                      <div className="text-xs text-zinc-400">{r.car} · Verified Customer</div>
                    </div>
                    <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                      ▶ Video Review
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute -bottom-14 left-0 flex items-center gap-3">
                <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full glass text-white hover:border-white/30">
                  ←
                </button>
                <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full glass text-white hover:border-white/30">
                  →
                </button>
                <div className="ml-2 flex gap-1.5">
                  {REVIEWS.map((_, k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setDir(k > i ? 1 : -1);
                        setI(k);
                      }}
                      className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-red-500" : "w-1.5 bg-zinc-600"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Mini stack */}
          <Reveal delay={0.1}>
            <div className="space-y-3">
              {REVIEWS.filter((_, k) => k !== i)
                .slice(0, 3)
                .map((m) => (
                  <div key={m.name} className="flex items-center gap-3 rounded-xl glass-light p-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${m.hue} text-xs font-bold text-white`}>
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{m.name}</span>
                        <Stars n={m.rating} />
                      </div>
                      <p className="truncate text-xs text-zinc-400">{m.text}</p>
                    </div>
                  </div>
                ))}
              <div className="flex gap-2 pt-2">
                {["🏆 Best of Region", "✓ Google Verified", "🛡 BBB A+"].map((b) => (
                  <span key={b} className="rounded-lg glass-light px-2.5 py-1.5 text-[10px] font-medium text-zinc-300">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

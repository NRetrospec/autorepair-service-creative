import { REASONS, WHY } from "../data/content";
import { SectionLabel, Reveal, Counter, Tach } from "../components/ui";
import { motion } from "framer-motion";

export default function Why() {
  return (
    <section className="relative min-h-screen overflow-hidden carbon section-pad">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Why APEX</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="metal-text">The numbers don't lie.</span>{" "}
            <span className="text-zinc-500">Neither do we.</span>
          </h2>
        </Reveal>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-2xl glass p-6 transition-transform hover:-translate-y-1">
                <div className="text-2xl">{r.icon}</div>
                <div className="mt-3 font-display text-5xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                    <Counter to={parseFloat(r.stat)} />
                  </span>
                  <span className="text-red-500">{r.suffix}</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-zinc-200">{r.label}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{r.desc}</div>
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-600/0 blur-2xl transition-all group-hover:bg-red-600/20" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr,1fr]">
          {/* Reason list */}
          <div className="grid gap-3 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.05}>
                <div className="group flex items-start gap-3 rounded-xl glass-light p-4 transition-colors hover:border-red-500/40">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-600/15 text-red-500 ring-1 ring-red-600/30">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{w.title}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{w.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Tach infographic */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl glass p-8">
              <div className="absolute inset-0 brushed opacity-20" />
              <div className="relative">
                <div className="mb-1 text-xs uppercase tracking-[0.3em] text-zinc-500">Performance Dashboard</div>
                <div className="mb-6 font-display text-xl font-bold text-white">Shop Vitals · Live</div>
                <div className="grid grid-cols-2 gap-6">
                  <Tach value={98} label="On-Time" suffix="%" />
                  <Tach value={4.9} max={5} label="Rating" suffix="" />
                  <Tach value={94} label="Same-Day" suffix="%" />
                  <Tach value={100} label="Warrantied" suffix="%" />
                </div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-6 flex items-center gap-2 text-[11px] text-emerald-400"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> All systems nominal
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

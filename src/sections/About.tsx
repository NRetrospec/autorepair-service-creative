import { motion } from "framer-motion";
import { TIMELINE, TEAM } from "../data/content";
import { SectionLabel, Reveal } from "../components/ui";

export default function About() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-matte section-pad">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-red-700/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="chrome-text">Three decades</span>{" "}
            <span className="text-zinc-500">of torque, trust & precision.</span>
          </h2>
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-14">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-red-600 via-zinc-700 to-transparent md:left-1/2" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div className={`relative flex items-center gap-6 md:gap-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <motion.div
                    whileInView={{ scale: [0.6, 1.2, 1] }}
                    viewport={{ once: true }}
                    className="absolute left-3 z-10 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-red-500 ring-4 ring-red-600/20 md:left-1/2"
                  />
                  <div className="ml-10 flex-1 rounded-2xl glass p-5 md:ml-0 md:max-w-[45%]">
                    <div className="font-display text-3xl font-extrabold text-red-500/90">{t.year}</div>
                    <div className="mt-1 font-semibold text-white">{t.title}</div>
                    <p className="mt-1 text-sm text-zinc-400">{t.desc}</p>
                  </div>
                  <div className="hidden flex-1 md:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Team */}
        <Reveal>
          <div className="mb-6 mt-16 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Meet the Crew</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <motion.div whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl glass p-6 text-center">
                <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${m.hue} font-display text-2xl font-bold text-white shadow-lg`}>
                  {m.initials}
                </div>
                <div className="mt-4 font-semibold text-white">{m.name}</div>
                <div className="text-xs text-red-400">{m.role}</div>
                <div className="mt-1 text-[11px] text-zinc-500">{m.spec}</div>
                <div className="mt-3 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <span key={k} className="text-[10px] text-amber-400">★</span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Certifications */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 rounded-2xl glass p-6">
            {["ASE Master Certified", "BBB A+ Accredited", "AAA Approved", "I-CAR Gold", "Best of Region 2026", "EV Certified"].map(
              (c) => (
                <span key={c} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300">
                  🏅 {c}
                </span>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

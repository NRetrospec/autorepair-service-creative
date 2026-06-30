import { motion } from "framer-motion";
import { BRAND } from "../data/content";
import { SectionLabel, Reveal, Btn } from "../components/ui";

export default function Contact({ go }: { go: (id: string) => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-matte section-pad">
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-700/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="chrome-text">Roll in.</span> <span className="text-zinc-500">We're ready.</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr,1fr]">
          {/* Map */}
          <Reveal>
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 carbon">
              <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 60% 40%, rgba(225,6,0,0.15), transparent 60%)" }} />
              {/* stylized map grid */}
              <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
                <defs>
                  <pattern id="map" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M50 0 L0 0 0 50" fill="none" stroke="#3a3e46" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map)" />
                <path d="M0 280 Q200 200 400 260 T800 240" fill="none" stroke="#555" strokeWidth="6" opacity="0.4" />
                <path d="M300 0 L320 500" fill="none" stroke="#555" strokeWidth="8" opacity="0.4" />
              </svg>
              {/* pin */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-red-600 pulse-ring shadow-lg">📍</div>
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl glass p-4">
                <div>
                  <div className="font-display font-bold text-white">{BRAND.full}</div>
                  <div className="text-xs text-zinc-400">{BRAND.address}</div>
                </div>
                <Btn variant="ghost" onClick={() => window.open("https://maps.google.com", "_blank")}>
                  Directions →
                </Btn>
              </div>
            </div>
          </Reveal>

          {/* Contact cards */}
          <div className="grid gap-4">
            <Reveal delay={0.05}>
              <div className="rounded-2xl glass p-5">
                <div className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">Hours</div>
                {BRAND.hours.map((h) => (
                  <div key={h.day} className="flex justify-between border-b border-white/5 py-2 text-sm last:border-0">
                    <span className="text-zinc-400">{h.day}</span>
                    <span className="font-medium text-white">{h.time}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-5 glow-red">
                <div className="text-xs uppercase tracking-[0.3em] text-red-100">24/7 Emergency</div>
                <a href={`tel:${BRAND.emergency}`} className="mt-1 block font-display text-2xl font-extrabold text-white">
                  {BRAND.emergency}
                </a>
                <p className="mt-1 text-xs text-red-100/80">Roadside diagnostics & towing dispatch</p>
              </motion.div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${BRAND.phone}`} className="rounded-2xl glass-light p-4 transition hover:border-white/25">
                  <div className="text-lg">📞</div>
                  <div className="mt-1 text-xs text-zinc-500">Call</div>
                  <div className="text-sm font-semibold text-white">{BRAND.phone}</div>
                </a>
                <a href={`mailto:${BRAND.email}`} className="rounded-2xl glass-light p-4 transition hover:border-white/25">
                  <div className="text-lg">✉️</div>
                  <div className="mt-1 text-xs text-zinc-500">Email</div>
                  <div className="truncate text-sm font-semibold text-white">{BRAND.email}</div>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-center justify-between rounded-2xl glass-light p-4">
                <span className="text-sm text-zinc-400">Follow the build</span>
                <div className="flex gap-2">
                  {["IG", "YT", "TT", "FB"].map((s) => (
                    <span key={s} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-xs font-bold text-zinc-300 ring-1 ring-white/10 transition hover:bg-red-600 hover:text-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* CTA + footer */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl glass p-10 text-center">
            <h3 className="font-display text-3xl font-extrabold md:text-4xl">
              <span className="metal-text">Ready to feel the difference?</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Btn onClick={() => go("booking")}>Schedule Service →</Btn>
              <Btn variant="ghost" onClick={() => go("hero")}>
                Back to Top ↑
              </Btn>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row">
          <span>© 2026 {BRAND.full}. Engineered with precision.</span>
          <span>ASE Certified · Family Owned Since 1998</span>
        </div>
      </div>
    </section>
  );
}

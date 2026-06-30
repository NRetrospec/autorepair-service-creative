import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BRAND } from "../data/content";

export interface NavItem {
  id: string;
  label: string;
}

export default function Nav({
  items,
  current,
  go,
  onPortal,
  onAdmin,
}: {
  items: NavItem[];
  current: string;
  go: (id: string) => void;
  onPortal: () => void;
  onAdmin: () => void;
}) {
  const [open, setOpen] = useState(false);

  const click = (id: string) => {
    setOpen(false);
    go(id);
  };

  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-[150] flex items-center justify-between px-4 py-4 sm:px-8">
        <button onClick={() => click("hero")} className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center">
            <svg viewBox="0 0 40 40" className="h-9 w-9 animate-spin-slow group-hover:animate-spin-med">
              <circle cx="20" cy="20" r="18" fill="#0e0f12" stroke="#3a3e46" strokeWidth="1.5" />
              {Array.from({ length: 5 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 72} 20 20)`}>
                  <path d="M20 20 L17 7 Q20 5 23 7 Z" fill="#c7ccd4" />
                </g>
              ))}
              <circle cx="20" cy="20" r="4" fill="#e10600" />
            </svg>
          </span>
          <div className="leading-none">
            <div className="font-display text-lg font-extrabold tracking-[0.18em] chrome-text">{BRAND.name}</div>
            <div className="text-[8px] uppercase tracking-[0.3em] text-zinc-500">Auto Werks</div>
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 lg:flex">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => click(it.id)}
              className={`relative rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                current === it.id ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {current === it.id && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600/90 to-red-700/90 glow-red"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{it.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onPortal}
            className="hidden rounded-full glass px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/25 sm:block"
          >
            Customer Portal
          </button>
          <button
            onClick={onAdmin}
            className="hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition hover:brightness-125 md:block"
          >
            Admin
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full glass lg:hidden"
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className="block h-0.5 w-5 bg-white" />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-0.5 w-5 bg-white" />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className="block h-0.5 w-5 bg-white" />
            </div>
          </button>
        </div>
      </header>

      {/* Side rail wheel indicators (desktop) */}
      <div className="fixed right-5 top-1/2 z-[140] hidden -translate-y-1/2 flex-col gap-3.5 xl:flex">
        {items.map((it) => (
          <button key={it.id} onClick={() => click(it.id)} className="group relative flex items-center justify-end gap-3">
            <span className="pointer-events-none absolute right-7 whitespace-nowrap rounded-md glass px-2.5 py-1 text-[10px] font-medium text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100">
              {it.label}
            </span>
            <span
              className={`relative grid h-4 w-4 place-items-center rounded-full border transition-all ${
                current === it.id ? "border-red-500" : "border-zinc-600 group-hover:border-zinc-300"
              }`}
            >
              <motion.span
                animate={{ rotate: current === it.id ? 360 : 0 }}
                transition={{ duration: 3, repeat: current === it.id ? Infinity : 0, ease: "linear" }}
                className={`block h-2.5 w-2.5 rounded-full ${current === it.id ? "bg-red-500" : "bg-zinc-600"}`}
                style={
                  current === it.id
                    ? { boxShadow: "0 0 10px #e10600", backgroundImage: "conic-gradient(#e10600,#ff6b5c,#e10600)" }
                    : {}
                }
              />
            </span>
          </button>
        ))}
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[145] flex flex-col items-center justify-center carbon lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" />
            <nav className="relative flex flex-col items-center gap-1">
              {items.map((it, i) => (
                <motion.button
                  key={it.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => click(it.id)}
                  className={`font-display text-3xl font-bold tracking-tight transition-colors ${
                    current === it.id ? "text-red-500" : "text-zinc-300"
                  }`}
                >
                  {it.label}
                </motion.button>
              ))}
              <div className="mt-8 flex gap-3">
                <button onClick={() => { setOpen(false); onPortal(); }} className="rounded-full glass px-5 py-2.5 text-sm font-semibold">
                  Portal
                </button>
                <button onClick={() => { setOpen(false); onAdmin(); }} className="rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/10">
                  Admin
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

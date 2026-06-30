import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { api, type Appointment, type ApptStatus, type User } from "../lib/api";
import { Counter } from "./ui";

const STATUSES: ApptStatus[] = ["Pending", "Confirmed", "In Progress", "Awaiting Approval", "Completed"];
const statusColor: Record<string, string> = {
  Pending: "text-zinc-400 bg-zinc-500/15",
  Confirmed: "text-sky-400 bg-sky-500/15",
  "In Progress": "text-amber-400 bg-amber-500/15",
  "Awaiting Approval": "text-red-400 bg-red-500/15",
  Completed: "text-emerald-400 bg-emerald-500/15",
};

const NAV = [
  { id: "overview", label: "Dashboard", icon: "📊" },
  { id: "appts", label: "Appointments", icon: "📅" },
  { id: "customers", label: "Customers", icon: "👥" },
  { id: "inventory", label: "Inventory", icon: "📦" },
  { id: "cms", label: "Website CMS", icon: "🌐" },
];

export default function Admin({ user, onClose, onLogout }: { user: User; onClose: () => void; onLogout: () => void }) {
  const [view, setView] = useState("overview");
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  const refresh = () => {
    api.listAppointments().then(setAppts);
    api.listCustomers().then(setCustomers);
  };
  useEffect(refresh, []);

  const revenue = appts.reduce((s, a) => s + (a.paid ? a.estimate : 0), 0);
  const pipeline = appts.reduce((s, a) => s + (!a.paid ? a.estimate : 0), 0);
  const completed = appts.filter((a) => a.status === "Completed").length;

  const setStatus = async (id: string, status: ApptStatus) => {
    await api.updateAppointment(id, { status, ...(status === "Completed" ? { approved: true } : {}) });
    refresh();
  };

  return (
    <motion.div className="fixed inset-0 z-[250] flex carbon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-black/30 p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white">⚙️</span>
          <div>
            <div className="font-display font-bold text-white">APEX Ops</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Admin Console</div>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                view === n.id ? "bg-red-600/15 font-semibold text-white ring-1 ring-red-600/30" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <button onClick={onLogout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-zinc-400 hover:bg-white/5">↩ Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5 backdrop-blur">
          <div>
            <div className="font-display text-lg font-bold capitalize text-white">{NAV.find((n) => n.id === view)?.label}</div>
            <div className="text-[11px] text-zinc-500">Signed in as {user.name} · Admin (RBAC)</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setView(n.id)} className={`rounded-lg px-2 py-1 text-xs md:hidden ${view === n.id ? "text-white" : "text-zinc-500"}`}>{n.icon}</button>
              ))}
            </div>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full glass text-white">✕</button>
          </div>
        </header>

        {/* mobile nav */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 px-4 py-2 md:hidden no-scrollbar">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setView(n.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${view === n.id ? "bg-red-600 text-white" : "glass-light text-zinc-400"}`}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {view === "overview" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      { l: "Revenue (paid)", v: revenue, p: "$", c: "from-emerald-500/20" },
                      { l: "Pipeline", v: pipeline, p: "$", c: "from-amber-500/20" },
                      { l: "Active Jobs", v: appts.length, p: "", c: "from-sky-500/20" },
                      { l: "Completed", v: completed, p: "", c: "from-red-500/20" },
                    ].map((s) => (
                      <div key={s.l} className={`rounded-2xl bg-gradient-to-br ${s.c} to-transparent glass p-5`}>
                        <div className="text-xs text-zinc-400">{s.l}</div>
                        <div className="mt-1 font-display text-3xl font-extrabold text-white">
                          {s.p}<Counter to={s.v} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* revenue bars */}
                  <div className="rounded-2xl glass p-5">
                    <div className="mb-4 font-display font-bold text-white">Revenue · Last 7 days</div>
                    <div className="flex h-40 items-end gap-3">
                      {[42, 68, 35, 80, 55, 92, 70].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.06, type: "spring", stiffness: 120 }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-red-700 to-red-400"
                          />
                          <span className="text-[10px] text-zinc-600">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl glass p-5">
                    <div className="mb-3 font-display font-bold text-white">🔔 Notifications</div>
                    {[
                      "New booking received — AP-2055 · Range Rover suspension",
                      "Estimate awaiting approval — Elena Vasquez ($890)",
                      "Low stock alert — Brake pads (OEM, 4 left)",
                    ].map((n) => (
                      <div key={n} className="flex items-center gap-2 border-b border-white/5 py-2.5 text-sm text-zinc-300 last:border-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === "appts" && (
                <div className="space-y-3">
                  {appts.map((a) => (
                    <div key={a.id} className="rounded-2xl glass p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{a.customer}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[a.status]}`}>{a.status}</span>
                          </div>
                          <div className="text-xs text-zinc-500">{a.service} · {a.vehicle}</div>
                          <div className="text-xs text-zinc-500">{a.date} {a.time} · {a.technician} · {a.id}</div>
                        </div>
                        <div className="font-display text-lg font-bold text-white">${a.estimate.toLocaleString()}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(a.id, s)}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                              a.status === s ? "bg-red-600 text-white" : "glass-light text-zinc-400 hover:text-white"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === "customers" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {customers.map((c) => {
                    const cAppts = appts.filter((a) => a.email === c.email);
                    return (
                      <div key={c.email} className="rounded-2xl glass p-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 font-bold text-white">
                            {c.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{c.name}</div>
                            <div className="text-xs text-zinc-500">{c.email}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-zinc-400">
                          <span>{cAppts.length} repairs</span>
                          <span>{c.vehicles.length} vehicles</span>
                          <span className="text-emerald-400">${cAppts.reduce((s, a) => s + a.estimate, 0).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === "inventory" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { n: "Synthetic Oil (5W-30)", q: 84, max: 100 },
                    { n: "Brake Pads (OEM)", q: 4, max: 40 },
                    { n: "Performance Tires", q: 22, max: 30 },
                    { n: "Air Filters", q: 56, max: 80 },
                    { n: "AGM Batteries", q: 12, max: 25 },
                    { n: "Spark Plugs", q: 140, max: 200 },
                  ].map((it) => {
                    const pct = (it.q / it.max) * 100;
                    const low = pct < 25;
                    return (
                      <div key={it.n} className="rounded-2xl glass p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{it.n}</span>
                          {low && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">LOW</span>}
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">{it.q} in stock</div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-700">
                          <div className={`h-full rounded-full ${low ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-amber-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === "cms" && (
                <div className="space-y-3">
                  <div className="rounded-2xl glass p-5">
                    <div className="font-display font-bold text-white">Hero Headline</div>
                    <input defaultValue="Precision Repairs. Performance You Can Trust." className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="rounded-2xl glass p-5">
                    <div className="font-display font-bold text-white">Promo Banner</div>
                    <input defaultValue="Spring Special — 15% off all brake services" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500" />
                    <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                      <input type="checkbox" defaultChecked className="accent-red-600" /> Banner active
                    </label>
                  </div>
                  <button className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white glow-red">Publish Changes</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

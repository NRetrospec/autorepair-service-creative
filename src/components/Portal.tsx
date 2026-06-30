import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { api, type Appointment, type User } from "../lib/api";
import { Btn } from "./ui";

const STATUS_ORDER: Appointment["status"][] = ["Pending", "Confirmed", "In Progress", "Awaiting Approval", "Completed"];
const statusColor: Record<string, string> = {
  Pending: "text-zinc-400 bg-zinc-500/15",
  Confirmed: "text-sky-400 bg-sky-500/15",
  "In Progress": "text-amber-400 bg-amber-500/15",
  "Awaiting Approval": "text-red-400 bg-red-500/15",
  Completed: "text-emerald-400 bg-emerald-500/15",
};

function Progress({ status }: { status: Appointment["status"] }) {
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div className="mt-3 flex items-center gap-1">
      {STATUS_ORDER.map((s, i) => (
        <div key={s} className="flex flex-1 items-center">
          <div className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-red-500" : "bg-zinc-700"}`} />
        </div>
      ))}
    </div>
  );
}

export default function Portal({ user, onClose, onLogout }: { user: User; onClose: () => void; onLogout: () => void }) {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<"repairs" | "vehicles" | "chat">("repairs");
  const [loading, setLoading] = useState(true);
  const [msgs, setMsgs] = useState([{ from: "tech", text: "Hi! Your M3 is on the lift now — sending photos of the downpipe shortly. 🔧" }]);
  const [draft, setDraft] = useState("");

  const refresh = () => {
    setLoading(true);
    api.listAppointments(user).then((a) => {
      setAppts(a);
      setLoading(false);
    });
  };
  useEffect(refresh, [user]);

  const approve = async (a: Appointment) => {
    await api.updateAppointment(a.id, { approved: true, status: "In Progress" });
    refresh();
  };
  const pay = async (a: Appointment) => {
    await api.updateAppointment(a.id, { paid: true });
    refresh();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[250] overflow-y-auto carbon"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 font-bold text-white">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white">Welcome back, {user.name.split(" ")[0]}</div>
              <div className="text-xs text-zinc-500">Customer Portal · {user.email}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onLogout} className="rounded-full glass-light px-4 py-2 text-xs font-semibold text-zinc-300">
              Sign out
            </button>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full glass text-white">✕</button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2">
          {(["repairs", "vehicles", "chat"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                tab === t ? "bg-red-600 text-white glow-red" : "glass-light text-zinc-400"
              }`}
            >
              {t === "repairs" ? "🔧 Repairs" : t === "vehicles" ? "🚗 Garage" : "💬 Chat"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
            {tab === "repairs" && (
              <div className="space-y-3">
                {loading && <div className="py-10 text-center text-zinc-500">Loading repairs…</div>}
                {!loading && appts.length === 0 && (
                  <div className="rounded-2xl glass p-10 text-center text-zinc-500">No repairs yet. Book your first service!</div>
                )}
                {appts.map((a) => (
                  <div key={a.id} className="rounded-2xl glass p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-white">{a.service}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[a.status]}`}>{a.status}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">{a.vehicle} · {a.id}</div>
                        <div className="mt-0.5 text-xs text-zinc-500">{a.date} · {a.time} · {a.technician}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold text-white">${a.estimate.toLocaleString()}</div>
                        <div className="text-[10px] text-zinc-500">{a.paid ? "Paid ✓" : "Estimate"}</div>
                      </div>
                    </div>
                    <Progress status={a.status} />
                    {a.issue && <p className="mt-3 rounded-lg bg-black/30 p-2.5 text-xs text-zinc-400">"{a.issue}"</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {!a.approved && (
                        <Btn onClick={() => approve(a)} className="!px-4 !py-2 !text-xs">
                          ✓ Approve Estimate
                        </Btn>
                      )}
                      {a.status === "Completed" && !a.paid && (
                        <Btn variant="amber" onClick={() => pay(a)} className="!px-4 !py-2 !text-xs">
                          💳 Pay ${a.estimate.toLocaleString()}
                        </Btn>
                      )}
                      {a.paid && (
                        <button className="rounded-full glass-light px-4 py-2 text-xs font-semibold text-zinc-300">⬇ Download Receipt</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "vehicles" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(user.vehicles.length ? user.vehicles : ["Add your first vehicle"]).map((v) => (
                  <div key={v} className="rounded-2xl glass p-5">
                    <div className="text-2xl">🚗</div>
                    <div className="mt-2 font-display font-bold text-white">{v}</div>
                    <div className="mt-1 text-xs text-zinc-500">Next service reminder: in 2,400 mi</div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-700">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                    </div>
                  </div>
                ))}
                <button className="grid place-items-center rounded-2xl border border-dashed border-white/20 p-5 text-sm text-zinc-400 hover:border-red-500 hover:text-white">
                  + Add Vehicle
                </button>
              </div>
            )}

            {tab === "chat" && (
              <div className="flex h-[420px] flex-col rounded-2xl glass">
                <div className="flex items-center gap-2 border-b border-white/10 p-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-xs font-bold text-white">RK</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Ray Kessler</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online</div>
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "me" ? "bg-red-600 text-white" : "glass-light text-zinc-200"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-white/10 p-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && draft.trim()) {
                        setMsgs((m) => [...m, { from: "me", text: draft }]);
                        setDraft("");
                        setTimeout(() => setMsgs((m) => [...m, { from: "tech", text: "Got it 👍 I'll update your estimate now." }]), 900);
                      }
                    }}
                    placeholder="Message your technician…"
                    className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

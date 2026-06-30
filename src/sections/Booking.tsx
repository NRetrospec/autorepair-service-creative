import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SERVICES, TECHNICIANS } from "../data/content";
import { SectionLabel, Reveal, Btn } from "../components/ui";
import { api } from "../lib/api";

const STEPS = ["Service", "Vehicle", "Tech", "Schedule", "Details", "Done"];
const TIMES = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"];

function calendarDays() {
  const today = new Date();
  return Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service: "",
    vehicle: "",
    technician: "",
    date: "",
    time: "",
    issue: "",
    name: "",
    email: "",
    photos: 0,
  });
  const [loading, setLoading] = useState(false);
  const [confId, setConfId] = useState("");

  const up = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const days = calendarDays();

  const canNext = [
    !!form.service,
    !!form.vehicle,
    !!form.technician,
    !!form.date && !!form.time,
    !!form.name && /\S+@\S+/.test(form.email),
  ];

  const submit = async () => {
    setLoading(true);
    const appt = await api.createAppointment({
      service: form.service,
      vehicle: form.vehicle,
      technician: form.technician,
      date: form.date,
      time: form.time,
      issue: form.issue,
      customer: form.name,
      email: form.email,
    });
    setConfId(appt.id);
    setLoading(false);
    setStep(5);
  };

  return (
    <section className="relative min-h-screen overflow-hidden carbon section-pad">
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-electric/10 blur-[120px]" />
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>Reserve Your Bay</SectionLabel>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="chrome-text">Book in</span> <span className="text-red-500">60 seconds.</span>
          </h2>
        </Reveal>

        {/* Progress */}
        <Reveal delay={0.05}>
          <div className="mb-8 mt-10 flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: i === step ? 1.15 : 1,
                      backgroundColor: i <= step ? "#e10600" : "#22252b",
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white ring-1 ring-white/10"
                  >
                    {i < step ? "✓" : i + 1}
                  </motion.div>
                  <span className={`mt-1.5 hidden text-[10px] sm:block ${i === step ? "text-white" : "text-zinc-500"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div className="h-full bg-red-500" animate={{ width: i < step ? "100%" : "0%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="rounded-3xl glass p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              {step === 0 && (
                <div>
                  <h3 className="mb-4 font-display text-xl font-bold">What does your vehicle need?</h3>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => up("service", s.name)}
                        className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-all ${
                          form.service === s.name ? "border-red-500 bg-red-600/10 text-white" : "border-white/10 text-zinc-300 hover:border-white/25"
                        }`}
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-xs font-medium">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="mb-4 font-display text-xl font-bold">Tell us about your vehicle</h3>
                  <input
                    value={form.vehicle}
                    onChange={(e) => up("vehicle", e.target.value)}
                    placeholder="e.g. 2021 BMW M3 Competition"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none focus:border-red-500"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Sedan", "SUV", "Truck", "Performance", "EV", "Classic"].map((t) => (
                      <button
                        key={t}
                        onClick={() => up("vehicle", form.vehicle ? form.vehicle : t)}
                        className="rounded-full glass-light px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="mb-4 font-display text-xl font-bold">Choose your technician</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TECHNICIANS.map((t) => (
                      <button
                        key={t}
                        onClick={() => up("technician", t)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          form.technician === t ? "border-red-500 bg-red-600/10" : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <div className="text-sm font-semibold text-white">{t}</div>
                        <div className="text-[11px] text-zinc-500">{t === "First Available" ? "Fastest scheduling" : "ASE Certified"}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="mb-4 font-display text-xl font-bold">Pick a date & time</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {days.map((d) => {
                      const iso = d.toISOString().slice(0, 10);
                      return (
                        <button
                          key={iso}
                          onClick={() => up("date", iso)}
                          className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all ${
                            form.date === iso ? "border-red-500 bg-red-600/10 text-white" : "border-white/10 text-zinc-400 hover:border-white/25"
                          }`}
                        >
                          <span className="text-[10px] uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</span>
                          <span className="font-display text-xl font-bold">{d.getDate()}</span>
                          <span className="text-[10px]">{d.toLocaleDateString("en", { month: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => up("time", t)}
                        className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${
                          form.time === t ? "border-red-500 bg-red-600/10 text-white" : "border-white/10 text-zinc-400 hover:border-white/25"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <h3 className="mb-1 font-display text-xl font-bold">Almost there</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={(e) => up("name", e.target.value)}
                      placeholder="Full name"
                      className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                    <input
                      value={form.email}
                      onChange={(e) => up("email", e.target.value)}
                      placeholder="Email for confirmation"
                      className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <textarea
                    value={form.issue}
                    onChange={(e) => up("issue", e.target.value)}
                    placeholder="Describe the issue (sounds, warning lights, when it happens...)"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-500"
                  />
                  <button
                    onClick={() => up("photos", form.photos + 1)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-4 text-sm text-zinc-400 hover:border-red-500 hover:text-white"
                  >
                    📷 Upload photos / video {form.photos > 0 && `· ${form.photos} attached`}
                  </button>
                </div>
              )}

              {step === 5 && (
                <div className="py-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 360] }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl"
                  >
                    ✓
                  </motion.div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">Booking Confirmed!</h3>
                  <p className="mt-1 text-zinc-400">
                    Confirmation <span className="font-mono text-red-400">{confId}</span> sent to {form.email}
                  </p>
                  <div className="mx-auto mt-5 max-w-sm space-y-1.5 rounded-2xl glass-light p-4 text-left text-sm">
                    <div className="flex justify-between"><span className="text-zinc-500">Service</span><span className="text-white">{form.service}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Vehicle</span><span className="text-white">{form.vehicle}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Tech</span><span className="text-white">{form.technician}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">When</span><span className="text-white">{form.date} · {form.time}</span></div>
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">Track this repair anytime in your Customer Portal.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 5 && (
            <div className="mt-7 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`text-sm text-zinc-400 hover:text-white ${step === 0 ? "invisible" : ""}`}
              >
                ← Back
              </button>
              {step < 4 ? (
                <Btn onClick={() => canNext[step] && setStep((s) => s + 1)} disabled={!canNext[step]}>
                  Continue →
                </Btn>
              ) : (
                <Btn onClick={submit} disabled={!canNext[4] || loading}>
                  {loading ? "Reserving…" : "Confirm Booking ✓"}
                </Btn>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

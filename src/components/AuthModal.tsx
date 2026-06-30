import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { api, type Role, type User } from "../lib/api";
import { Btn } from "./ui";

export default function AuthModal({
  role,
  onClose,
  onAuthed,
}: {
  role: Role | null;
  onClose: () => void;
  onAuthed: (u: User) => void;
}) {
  const [email, setEmail] = useState(role === "admin" ? "admin@apex.com" : "demo@apex.com");
  const [pw, setPw] = useState("demo123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!role) return;
    setErr("");
    setLoading(true);
    try {
      const u = await api.login(email, pw, role);
      onAuthed(u);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {role && (
        <motion.div
          className="fixed inset-0 z-[300] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl glass p-7"
          >
            <div className="absolute inset-0 brushed opacity-20" />
            <div className="relative">
              <div className="mb-1 flex items-center gap-2">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${role === "admin" ? "bg-zinc-700" : "bg-red-600"} text-white`}>
                  {role === "admin" ? "🛠" : "👤"}
                </span>
                <div>
                  <div className="font-display font-bold text-white">{role === "admin" ? "Admin Access" : "Customer Portal"}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">Secure JWT Login</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                />
                <input
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  type="password"
                  placeholder="Password"
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                />
                {err && <p className="text-xs text-red-400">{err}</p>}
                <Btn onClick={submit} disabled={loading} className="w-full" variant={role === "admin" ? "ghost" : "primary"}>
                  {loading ? "Authenticating…" : "Sign In →"}
                </Btn>
              </div>
              <p className="mt-4 rounded-lg bg-black/30 p-2.5 text-center text-[11px] text-zinc-500">
                Demo prefilled · any email + 3+ char password works
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

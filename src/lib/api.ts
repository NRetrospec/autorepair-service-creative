// ─────────────────────────────────────────────────────────────
//  MOCK FULL-STACK API LAYER
//  Simulates a Node/Express + PostgreSQL REST backend with
//  JWT auth & role-based access. Persisted to localStorage so the
//  experience is fully functional in this single-file deployment.
//
//  Real backend mapping (documented for production):
//    POST   /api/auth/login        -> JWT issue
//    GET    /api/appointments      -> role-scoped
//    POST   /api/appointments      -> create booking
//    PATCH  /api/appointments/:id  -> update status (admin)
//    GET    /api/customers         -> admin only
//    GET    /api/analytics         -> admin only
// ─────────────────────────────────────────────────────────────

export type Role = "customer" | "admin";
export type ApptStatus = "Pending" | "Confirmed" | "In Progress" | "Awaiting Approval" | "Completed";

export interface Appointment {
  id: string;
  service: string;
  vehicle: string;
  technician: string;
  date: string;
  time: string;
  issue: string;
  status: ApptStatus;
  customer: string;
  email: string;
  estimate: number;
  approved: boolean;
  paid: boolean;
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
  role: Role;
  vehicles: string[];
}

const DB_KEY = "apex_db_v1";
const SESSION_KEY = "apex_session_v1";

interface DB {
  appointments: Appointment[];
  users: User[];
}

function seed(): DB {
  const now = Date.now();
  return {
    users: [
      { email: "admin@apex.com", name: "Tasha Brooks", role: "admin", vehicles: [] },
      { email: "demo@apex.com", name: "Marcus Reyes", role: "customer", vehicles: ["2021 BMW M3 Competition", "2018 Toyota Tacoma"] },
    ],
    appointments: [
      { id: "AP-2041", service: "Performance Upgrades", vehicle: "2021 BMW M3 Competition", technician: "Ray Kessler", date: "2026-02-14", time: "09:00", issue: "Stage 2 ECU tune + downpipe install.", status: "In Progress", customer: "Marcus Reyes", email: "demo@apex.com", estimate: 2450, approved: true, paid: false, createdAt: now - 86400000 * 2 },
      { id: "AP-2038", service: "Brake Systems", vehicle: "2018 Toyota Tacoma", technician: "Carlos Mendez", date: "2026-02-10", time: "13:00", issue: "Front pads grinding, rotor warp.", status: "Completed", customer: "Marcus Reyes", email: "demo@apex.com", estimate: 540, approved: true, paid: true, createdAt: now - 86400000 * 6 },
      { id: "AP-2049", service: "Engine Diagnostics", vehicle: "2020 Audi A7", technician: "Nina Patel", date: "2026-02-16", time: "10:30", issue: "Check engine light, rough idle.", status: "Awaiting Approval", customer: "Elena Vasquez", email: "elena@mail.com", estimate: 890, approved: false, paid: false, createdAt: now - 86400000 },
      { id: "AP-2052", service: "Oil & Filter Change", vehicle: "2022 Tesla Model 3", technician: "First Available", date: "2026-02-17", time: "08:00", issue: "Scheduled maintenance + tire rotation.", status: "Confirmed", customer: "David Chen", email: "david@mail.com", estimate: 120, approved: true, paid: false, createdAt: now - 3600000 * 10 },
      { id: "AP-2055", service: "Suspension & Steering", vehicle: "2019 Range Rover Sport", technician: "Carlos Mendez", date: "2026-02-18", time: "14:00", issue: "Air suspension fault, leaning rear.", status: "Pending", customer: "Sarah Whitfield", email: "sarah@mail.com", estimate: 1680, approved: false, paid: false, createdAt: now - 3600000 * 3 },
    ],
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = seed();
  localStorage.setItem(DB_KEY, JSON.stringify(s));
  return s;
}

function save(db: DB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async login(email: string, password: string, role: Role): Promise<User> {
    await delay();
    if (!email || password.length < 3) throw new Error("Invalid credentials.");
    const db = load();
    let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // auto-provision a customer account on first login (demo convenience)
      user = { email, name: email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), role, vehicles: [] };
      db.users.push(user);
      save(db);
    } else if (user.role !== role) {
      // honor stored role to enforce RBAC
      role = user.role;
    }
    const session = { ...user, token: "jwt." + btoa(email + ":" + Date.now()) };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return user;
  },

  session(): (User & { token: string }) | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    await delay(700);
    const db = load();
    const appt: Appointment = {
      id: "AP-" + Math.floor(2060 + Math.random() * 900),
      service: data.service || "General Service",
      vehicle: data.vehicle || "Unspecified Vehicle",
      technician: data.technician || "First Available",
      date: data.date || "",
      time: data.time || "",
      issue: data.issue || "",
      status: "Pending",
      customer: data.customer || "Guest",
      email: data.email || "guest@apex.com",
      estimate: Math.floor(120 + Math.random() * 1400),
      approved: false,
      paid: false,
      createdAt: Date.now(),
    };
    db.appointments.unshift(appt);
    save(db);
    return appt;
  },

  async listAppointments(user?: User): Promise<Appointment[]> {
    await delay(300);
    const db = load();
    if (!user || user.role === "admin") return db.appointments;
    return db.appointments.filter((a) => a.email.toLowerCase() === user.email.toLowerCase());
  },

  async updateAppointment(id: string, patch: Partial<Appointment>): Promise<void> {
    await delay(250);
    const db = load();
    const i = db.appointments.findIndex((a) => a.id === id);
    if (i >= 0) {
      db.appointments[i] = { ...db.appointments[i], ...patch };
      save(db);
    }
  },

  async listCustomers(): Promise<User[]> {
    await delay(300);
    return load().users.filter((u) => u.role === "customer");
  },
};

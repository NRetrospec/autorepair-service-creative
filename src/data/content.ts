export const BRAND = {
  name: "APEX",
  full: "APEX Auto Werks",
  phone: "(555) 247-8890",
  emergency: "(555) 911-AUTO",
  email: "service@apexautowerks.com",
  address: "1420 Redline Boulevard, Motor City, CA 90210",
  hours: [
    { day: "Mon – Fri", time: "7:00 AM – 7:00 PM" },
    { day: "Saturday", time: "8:00 AM – 5:00 PM" },
    { day: "Sunday", time: "Emergency Only" },
  ],
};

export type Service = {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  detail: string;
  price: string;
  time: string;
  accent: "racing" | "electric" | "amber" | "silver";
};

export const SERVICES: Service[] = [
  { id: "diag", name: "Engine Diagnostics", icon: "🔧", blurb: "Computer-precise fault detection", detail: "Full OBD-II scan, live data analysis, and certified diagnosis of any engine or drivetrain fault.", price: "from $89", time: "45 min", accent: "electric" },
  { id: "oil", name: "Oil & Filter Change", icon: "🛢️", blurb: "Synthetic & high-mileage blends", detail: "Premium full-synthetic oil, OEM filter, 21-point inspection, and fluid top-off included.", price: "from $69", time: "30 min", accent: "amber" },
  { id: "brake", name: "Brake Systems", icon: "🛑", blurb: "Stop with total confidence", detail: "Pads, rotors, calipers and brake-fluid flush using OEM-grade performance components.", price: "from $179", time: "2 hrs", accent: "racing" },
  { id: "trans", name: "Transmission Service", icon: "⚙️", blurb: "Smooth, engineered shifting", detail: "Fluid exchange, valve-body service, clutch repair and full rebuild capability.", price: "from $149", time: "3 hrs", accent: "silver" },
  { id: "susp", name: "Suspension & Steering", icon: "🏎️", blurb: "Track-grade ride dynamics", detail: "Struts, shocks, control arms and precision 4-wheel alignment for a planted, sharp drive.", price: "from $229", time: "2.5 hrs", accent: "electric" },
  { id: "elec", name: "Electrical Systems", icon: "⚡", blurb: "Every circuit, perfected", detail: "Alternators, starters, wiring, sensors and advanced module reprogramming.", price: "from $119", time: "1.5 hrs", accent: "amber" },
  { id: "tire", name: "Tire Replacement", icon: "🛞", blurb: "Grip that means business", detail: "Premium tire sourcing, road-force balancing, mounting and lifetime rotations.", price: "from $129", time: "1 hr", accent: "silver" },
  { id: "batt", name: "Battery Replacement", icon: "🔋", blurb: "Power on demand", detail: "AGM & lithium options, charging-system test and free installation.", price: "from $159", time: "30 min", accent: "electric" },
  { id: "ac", name: "Air Conditioning", icon: "❄️", blurb: "Climate-controlled comfort", detail: "Recharge, leak detection, compressor service and cabin-air filtration.", price: "from $99", time: "1 hr", accent: "electric" },
  { id: "exh", name: "Exhaust Systems", icon: "💨", blurb: "Flow, sound, performance", detail: "Catalytic converters, mufflers, performance cat-backs and emissions tuning.", price: "from $189", time: "2 hrs", accent: "racing" },
  { id: "perf", name: "Performance Upgrades", icon: "🚀", blurb: "Unlock hidden horsepower", detail: "ECU tuning, intakes, forced induction and dyno-verified power gains.", price: "custom", time: "varies", accent: "racing" },
  { id: "fleet", name: "Fleet Maintenance", icon: "🚐", blurb: "Keep the business moving", detail: "Scheduled service contracts, priority scheduling and downtime minimization.", price: "custom", time: "varies", accent: "amber" },
];

export type Reason = { stat: string; suffix: string; label: string; desc: string; icon: string };
export const REASONS: Reason[] = [
  { stat: "27", suffix: "+", label: "Years Engineering", desc: "Three decades perfecting the craft.", icon: "🏁" },
  { stat: "18", suffix: "K", label: "Vehicles Serviced", desc: "From daily drivers to supercars.", icon: "🚗" },
  { stat: "4.9", suffix: "★", label: "Average Rating", desc: "Across 2,400+ verified reviews.", icon: "⭐" },
  { stat: "98", suffix: "%", label: "Same-Day Repairs", desc: "Back on the road, fast.", icon: "⚡" },
];

export const WHY = [
  { title: "ASE Certified Technicians", desc: "Master-level training on every make and model." },
  { title: "Modern Diagnostic Equipment", desc: "Dealer-grade tooling without dealer-grade pricing." },
  { title: "Transparent Pricing", desc: "Written estimates approved before any work begins." },
  { title: "Warranty Protection", desc: "3-year / 36,000-mile nationwide warranty." },
  { title: "Honest Recommendations", desc: "We fix what's needed — and tell you what isn't." },
  { title: "Fast Turnaround", desc: "Most repairs completed the same day." },
  { title: "OEM Quality Parts", desc: "Genuine and OE-equivalent components only." },
];

export type Vehicle = {
  id: string;
  name: string;
  category: "Performance" | "Luxury" | "Daily" | "Restoration";
  work: string;
  hue: string;
};
export const GALLERY: Vehicle[] = [
  { id: "g1", name: "Porsche 911 GT3", category: "Performance", work: "Track suspension + brake overhaul", hue: "from-red-600/30 to-orange-500/10" },
  { id: "g2", name: "BMW M4 Competition", category: "Performance", work: "ECU tune + exhaust", hue: "from-sky-500/30 to-blue-700/10" },
  { id: "g3", name: "Mercedes S-Class", category: "Luxury", work: "Full electrical restoration", hue: "from-zinc-300/25 to-zinc-600/10" },
  { id: "g4", name: "Audi RS6 Avant", category: "Performance", work: "Turbo service + alignment", hue: "from-amber-400/30 to-yellow-600/10" },
  { id: "g5", name: "Range Rover Sport", category: "Luxury", work: "Air suspension rebuild", hue: "from-emerald-500/25 to-teal-700/10" },
  { id: "g6", name: "Ford Mustang GT", category: "Restoration", work: "Engine rebuild + paint", hue: "from-blue-600/30 to-indigo-700/10" },
  { id: "g7", name: "Toyota Camry", category: "Daily", work: "Brakes + transmission service", hue: "from-zinc-400/25 to-zinc-700/10" },
  { id: "g8", name: "Tesla Model S", category: "Luxury", work: "Battery diagnostics + tires", hue: "from-cyan-400/30 to-sky-700/10" },
];

export type Review = {
  name: string;
  car: string;
  rating: number;
  text: string;
  initials: string;
  hue: string;
};
export const REVIEWS: Review[] = [
  { name: "Marcus Reyes", car: "BMW M3", rating: 5, text: "Felt like dropping my car off at a Formula 1 pit lane. They diagnosed an issue two dealerships missed and had me back on the road same day.", initials: "MR", hue: "from-red-500 to-orange-500" },
  { name: "Elena Vasquez", car: "Audi A7", rating: 5, text: "Transparent pricing, photos of every step, and a warranty that actually means something. This is how every shop should operate.", initials: "EV", hue: "from-sky-500 to-blue-600" },
  { name: "David Chen", car: "Tesla Model 3", rating: 5, text: "The booking experience alone felt premium. The work? Flawless. My car drives better than the day I bought it.", initials: "DC", hue: "from-amber-400 to-orange-500" },
  { name: "Sarah Whitfield", car: "Range Rover", rating: 5, text: "Honest, fast, and genuinely kind. They told me a 'needed' repair from another shop wasn't necessary. Earned a customer for life.", initials: "SW", hue: "from-emerald-400 to-teal-600" },
  { name: "James Okafor", car: "Mustang GT", rating: 5, text: "Performance tune was dyno-verified with real numbers. These people are engineers, not just mechanics.", initials: "JO", hue: "from-violet-500 to-fuchsia-600" },
];

export const TIMELINE = [
  { year: "1998", title: "The First Bay", desc: "Founder Ray Kessler opens a single-bay garage with a torque wrench and a promise: honest work, every time." },
  { year: "2006", title: "Master Certification", desc: "The team earns full ASE Master status and expands to a six-bay facility." },
  { year: "2014", title: "Performance Division", desc: "APEX launches its dyno-equipped performance shop, drawing enthusiasts statewide." },
  { year: "2020", title: "Digital First", desc: "Real-time repair tracking and online booking transform the customer experience." },
  { year: "2026", title: "The Apex", desc: "Now a 14-bay flagship — voted Best Auto Repair in the region three years running." },
];

export const TEAM = [
  { name: "Ray Kessler", role: "Founder · Master Tech", spec: "Engine & Performance", initials: "RK", hue: "from-red-500 to-orange-600" },
  { name: "Nina Patel", role: "Lead Diagnostician", spec: "Electrical & EV Systems", initials: "NP", hue: "from-sky-400 to-blue-600" },
  { name: "Carlos Mendez", role: "Suspension Specialist", spec: "Chassis & Alignment", initials: "CM", hue: "from-amber-400 to-yellow-600" },
  { name: "Tasha Brooks", role: "Service Director", spec: "Customer Experience", initials: "TB", hue: "from-emerald-400 to-teal-600" },
];

export const TECHNICIANS = ["Ray Kessler", "Nina Patel", "Carlos Mendez", "First Available"];

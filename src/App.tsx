import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";
import Nav, { type NavItem } from "./components/Nav";
import WheelTransition from "./components/WheelTransition";
import AuthModal from "./components/AuthModal";
import Portal from "./components/Portal";
import Admin from "./components/Admin";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Why from "./sections/Why";
import Gallery from "./sections/Gallery";
import Reviews from "./sections/Reviews";
import About from "./sections/About";
import Booking from "./sections/Booking";
import Contact from "./sections/Contact";
import { api, type Role, type User } from "./lib/api";

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "why", label: "Why Us" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
  { id: "booking", label: "Book" },
  { id: "contact", label: "Contact" },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("hero");
  const [pending, setPending] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [authRole, setAuthRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(api.session());
  const [overlay, setOverlay] = useState<null | "portal" | "admin">(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Wheel transition between sections
  const go = useCallback(
    (id: string) => {
      if (id === page || transitioning) return;
      setPending(id);
      setTransitioning(true);
    },
    [page, transitioning]
  );

  const onMidpoint = useCallback(() => {
    if (pending) {
      setPage(pending);
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pending]);

  // End transition after wheel completes
  useEffect(() => {
    if (transitioning) {
      const t = setTimeout(() => {
        setTransitioning(false);
        setPending(null);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [transitioning]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overlay || authRole) return;
      const idx = NAV_ITEMS.findIndex((n) => n.id === page);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(NAV_ITEMS[Math.min(NAV_ITEMS.length - 1, idx + 1)].id);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(NAV_ITEMS[Math.max(0, idx - 1)].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, go, overlay, authRole]);

  const openAuth = (role: Role) => {
    const s = api.session();
    if (s && s.role === role) {
      setUser(s);
      setOverlay(role === "admin" ? "admin" : "portal");
    } else {
      setAuthRole(role);
    }
  };

  const onAuthed = (u: User) => {
    setUser(u);
    setOverlay(u.role === "admin" ? "admin" : "portal");
    setAuthRole(null);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setOverlay(null);
  };

  const renderPage = () => {
    switch (page) {
      case "hero":
        return <Hero go={go} />;
      case "services":
        return <Services go={go} />;
      case "why":
        return <Why />;
      case "gallery":
        return <Gallery />;
      case "reviews":
        return <Reviews />;
      case "about":
        return <About />;
      case "booking":
        return <Booking />;
      case "contact":
        return <Contact go={go} />;
      default:
        return <Hero go={go} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-matte">
      <div className="grain" />

      <AnimatePresence>{!loaded && <Loader onDone={() => setLoaded(true)} />}</AnimatePresence>

      {loaded && (
        <>
          <Nav
            items={NAV_ITEMS}
            current={page}
            go={go}
            onPortal={() => openAuth("customer")}
            onAdmin={() => openAuth("admin")}
          />

          <main ref={scrollRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          <WheelTransition active={transitioning} onMidpoint={onMidpoint} />
        </>
      )}

      <AuthModal role={authRole} onClose={() => setAuthRole(null)} onAuthed={onAuthed} />

      <AnimatePresence>
        {overlay === "portal" && user && (
          <Portal user={user} onClose={() => setOverlay(null)} onLogout={logout} />
        )}
        {overlay === "admin" && user && <Admin user={user} onClose={() => setOverlay(null)} onLogout={logout} />}
      </AnimatePresence>
    </div>
  );
}

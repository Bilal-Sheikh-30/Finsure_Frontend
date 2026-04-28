import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Logo } from "../Logo";
import { AnimatedButton } from "../ui/AnimatedButton";
import { useTheme } from "../../contexts/ThemeContext";

// Marketing nav entries — order reflects the typical SaaS funnel:
// product (Landing) → onboarding (Quickstart) → money (Pricing) → support (FAQs).
const navLinks = [
  { to: "/", label: "Product" },
  { to: "/quickstart", label: "Quickstart" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faqs", label: "FAQs" },
];

export const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { scrollY } = useScroll();
  // Flip to the 'scrolled' look (stronger blur + border) once the user has
  // moved past the first ~16px. Tiny threshold keeps the intent obvious
  // without being too jumpy on elastic scrolling.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  // Close the mobile drawer on route change — otherwise it can stick around
  // because the drawer lives outside the <Routes> subtree.
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-[backdrop-filter,background-color,border-color] duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-[var(--bg-primary)]/75 border-b border-[var(--border-color)]"
            : "backdrop-blur-md bg-[var(--bg-primary)]/30 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center" aria-label="FINSURE home">
            <Logo variant="inline" size={30} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[var(--text-primary)]/80 hover:text-[color:var(--accent)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {/* Animated cyan pill behind the active link. The
                        layoutId lets Framer smoothly morph the pill between
                        links as the active route changes. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-[var(--text-primary)]/80 hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex"
            >
              Login
            </AnimatedButton>

            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => navigate("/signup")}
              className="hidden sm:inline-flex"
            >
              Get Started
            </AnimatedButton>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[color:var(--accent-soft)]"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm z-50 md:hidden bg-[var(--bg-primary)] border-l border-[var(--border-color)] flex flex-col"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-[var(--border-color)]">
                <Logo variant="inline" size={28} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[color:var(--accent-soft)] text-[var(--text-primary)]"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)] ring-1 ring-[color:var(--accent-ring)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="p-5 border-t border-[var(--border-color)] flex flex-col gap-3">
                <AnimatedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </AnimatedButton>
                <AnimatedButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setOpen(false);
                    navigate("/signup");
                  }}
                >
                  Get Started Free
                </AnimatedButton>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 py-2 text-sm text-[var(--text-secondary)] hover:text-[color:var(--accent)] transition-colors"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  Switch to {theme === "dark" ? "light" : "dark"} mode
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

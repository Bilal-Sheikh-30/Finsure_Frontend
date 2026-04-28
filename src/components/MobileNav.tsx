import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  FileText,
  History,
  Info,
  Zap,
  DollarSign,
  HelpCircle,
  FileBarChart,
  BarChart3,
  Settings,
  Shield,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Bottom tab bar for mobile.
 *
 * Mirrors the desktop sidebar one-for-one: same destinations, same icons,
 * same labels. Because nine items don't fit on a 375px screen, the row is
 * horizontally scrollable with snap-to-item.
 *
 * Discoverability cues (so users actually realize they can swipe):
 *   1. A gradient edge fade on whichever side has more content off-screen.
 *   2. A small bouncing chevron on that same side.
 *   3. A one-time peek animation on first mount that nudges the rail
 *      rightwards a few pixels so motion catches the eye.
 *   4. The active tab auto-centers when the route changes.
 */
export const MobileNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const hasPeekedRef = useRef(false);

  const publicLinks = [
    { to: "/", label: "About", icon: Info },
    { to: "/quickstart", label: "Start", icon: Zap },
    { to: "/pricing", label: "Pricing", icon: DollarSign },
    { to: "/faqs", label: "FAQs", icon: HelpCircle },
  ];

  // Same order/labels as the desktop sidebar so muscle memory carries over.
  const authenticatedLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/extracted", label: "Extract", icon: FileText },
    { to: "/history", label: "History", icon: History },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/dashboards", label: "Charts", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/security", label: "Security", icon: Shield },
    { to: "/help", label: "Help", icon: HelpCircle },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  // Recompute "is there more content off-screen?" on scroll + resize so we
  // can hide the chevrons / fades when there's nothing left to reveal.
  const updateOverflow = () => {
    const el = scrollerRef.current;
    if (!el) return;
    // 2px tolerance handles sub-pixel rounding on retina screens.
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateOverflow();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", updateOverflow);
    return () => {
      el.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
    };
  }, [isAuthenticated]);

  // Auto-scroll the active item into view when route changes, then peek the
  // rail on first mount to telegraph that more icons live off-screen.
  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>("[data-active='true']");
    if (active) {
      const left =
        active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }

    // First-render peek: only meaningful when there's actually overflow.
    if (!hasPeekedRef.current) {
      hasPeekedRef.current = true;
      const peek = () => {
        if (container.scrollWidth <= container.clientWidth) return;
        const start = container.scrollLeft;
        // Nudge right ~36px, then back. Short delay so the auto-center
        // settles first; the user sees a clear "there's more →" gesture.
        window.setTimeout(() => {
          container.scrollTo({ left: start + 36, behavior: "smooth" });
          window.setTimeout(() => {
            container.scrollTo({ left: start, behavior: "smooth" });
          }, 450);
        }, 600);
      };
      peek();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/85 backdrop-blur-xl border-t border-[var(--border-color)] md:hidden z-40">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex items-stretch gap-1 px-2 py-1.5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {links.map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to !== "/" &&
                location.pathname.startsWith(link.to + "/"));
            return (
              <NavLink
                key={link.to}
                to={link.to}
                data-active={isActive}
                className="relative shrink-0 snap-center flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px] text-[10.5px] font-medium"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-1 inset-y-1 rounded-lg bg-[color:var(--accent-soft)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  <link.icon size={19} />
                </span>
                <span
                  className={`relative z-10 transition-colors leading-none ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Edge fades + bouncing chevrons — purely affordance, hidden when
            scrolled to the matching end so we don't lie about overflow. */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              key="left-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute inset-y-0 left-0 w-10 flex items-center justify-start pl-1"
              style={{
                background:
                  "linear-gradient(to right, var(--bg-secondary) 10%, transparent)",
              }}
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[color:var(--accent)] drop-shadow"
              >
                <ChevronLeft size={16} />
              </motion.span>
            </motion.div>
          )}
          {canScrollRight && (
            <motion.div
              key="right-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute inset-y-0 right-0 w-10 flex items-center justify-end pr-1"
              style={{
                background:
                  "linear-gradient(to left, var(--bg-secondary) 10%, transparent)",
              }}
            >
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[color:var(--accent)] drop-shadow"
              >
                <ChevronRight size={16} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* iOS home-indicator safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

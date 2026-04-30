import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Wraps any wide content (tables, card rows) in a horizontal scroll
 * container that telegraphs "there's more →" the same way the bottom
 * MobileNav does — edge fade + bouncing chevron — so users learn one
 * consistent overflow affordance across the app.
 *
 * Behaviour:
 *   • Right cue appears whenever there are pixels off-screen on the right.
 *   • Left cue appears once the user has scrolled past the start.
 *   • Cues fade out smoothly when the matching edge is reached, so we
 *     never lie about scroll state.
 *   • On first mount, the rail does a tiny rightwards "peek" so the
 *     hidden columns telegraph themselves before the user touches it.
 *
 * The container itself uses the .no-scrollbar utility from index.css so
 * the OS scrollbar doesn't compete with the visual cue.
 */
interface HorizontalScrollerProps {
  children: React.ReactNode;
  /** Override the wrapper className, e.g. extra rounding or padding. */
  className?: string;
  /** Disable the one-time auto-peek nudge. Default: enabled. */
  peekOnMount?: boolean;
}

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  className,
  peekOnMount = true,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const peekedRef = useRef(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Multi-pass measurement: a single sync read at mount routinely
    // misses real overflow because the child table hasn't laid out
    // yet (rows arrive async, fonts load late, mobile-emulation
    // resizes the iframe a tick after render). Read once now, again
    // after a frame, again after 100/400ms — cheap insurance.
    update();
    const raf = requestAnimationFrame(update);
    const t1 = window.setTimeout(update, 100);
    const t2 = window.setTimeout(update, 400);

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // ResizeObserver catches child width changes (table reflow after
    // rows load) that the window-resize listener wouldn't fire for.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    // MutationObserver catches the case where the children prop swaps
    // entirely (e.g. data fetch replaces a placeholder).
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, [update]);

  // First-mount peek: only useful when there's actual overflow.
  useEffect(() => {
    if (!peekOnMount || peekedRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    peekedRef.current = true;
    const tid = window.setTimeout(() => {
      if (el.scrollWidth <= el.clientWidth) return;
      const start = el.scrollLeft;
      el.scrollTo({ left: start + 40, behavior: "smooth" });
      window.setTimeout(() => {
        el.scrollTo({ left: start, behavior: "smooth" });
      }, 500);
    }, 700);
    return () => window.clearTimeout(tid);
  }, [peekOnMount]);

  // The relative wrapper deliberately does NOT use overflow-hidden — that
  // would clip the floating chevron pill. Instead the inner scroll
  // viewport inherits border-radius from the parent so the table content
  // still respects rounded corners visually.
  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        ref={scrollerRef}
        className="overflow-x-auto no-scrollbar scroll-smooth rounded-[inherit]"
      >
        {children}
      </div>

      {/* Floating accent pills — sit above the content like a "next" /
          "prev" button so the cue reads at a glance. The earlier subtle
          edge-fade got lost because it faded into the same surface
          colour as the table; an explicit gradient pill cuts through. */}
      <AnimatePresence>
        {canLeft && (
          <motion.div
            key="hs-left"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 z-20"
          >
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex w-8 h-8 rounded-full items-center justify-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                boxShadow:
                  "0 6px 18px -4px var(--accent-glow), 0 0 0 2px color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </motion.span>
          </motion.div>
        )}
        {canRight && (
          <motion.div
            key="hs-right"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 z-20"
          >
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex w-8 h-8 rounded-full items-center justify-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                boxShadow:
                  "0 6px 18px -4px var(--accent-glow), 0 0 0 2px color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
              }}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

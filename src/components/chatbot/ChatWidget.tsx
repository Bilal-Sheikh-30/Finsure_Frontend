import React, { useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "./ChatbotContext";
import { ChatPanel } from "./ChatPanel";

/**
 * Floating bottom-right launcher + sliding panel.
 *
 * - FAB gets a subtle accent halo pulse while idle so it doesn't feel dead.
 * - Panel slides in from bottom-right with a spring pop, crossfading with
 *   the FAB icon (Message <-> X) as it opens.
 */
export const ChatWidget: React.FC = () => {
  const { isOpen, toggle, close, unread } = useChatbot();

  // Close on Escape for quick dismissal.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Floating action button */}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close chat" : "Open FINSURE Assistant"}
        aria-expanded={isOpen}
        aria-controls="finsure-chat-widget-panel"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        // Mobile: lifted above the bottom MobileNav (≈64px + iOS safe area)
        // so the FAB never overlaps the tab bar. Desktop: parks at bottom-6.
        className="fixed z-[60] right-5 bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] md:right-6 md:bottom-6 w-14 h-14 rounded-full flex items-center justify-center text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent-ring)]"
        style={{
          background:
            "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          boxShadow:
            "0 14px 36px -10px var(--accent-glow), 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent)",
        }}
      >
        {/* Idle halo pulse */}
        {!isOpen && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full animate-ping-slow"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent) 0%, transparent 70%)",
            }}
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 flex"
          >
            {isOpen ? (
              <X size={22} strokeWidth={2.4} />
            ) : (
              <MessageCircle size={24} strokeWidth={2.2} />
            )}
          </motion.span>
        </AnimatePresence>

        {/* Unread indicator */}
        {!isOpen && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            aria-label={`${unread} unread`}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center border-2 border-[var(--bg-primary)]"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="finsure-chat-widget-panel"
            role="dialog"
            aria-modal="false"
            aria-label="FINSURE Assistant"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed z-[59] right-4 md:right-6 bottom-[calc(env(safe-area-inset-bottom,0px)+152px)] md:bottom-[96px] w-[min(400px,calc(100vw-2rem))] h-[min(600px,calc(100vh-200px))] md:h-[min(600px,calc(100vh-120px))] origin-bottom-right"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 32px 80px -16px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent)",
              }}
            >
              <ChatPanel showClear />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

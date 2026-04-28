import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Upload,
  LogOut,
  Sun,
  Moon,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";

/**
 * Sticky glass topbar for authenticated pages.
 *
 * Mirrors the public nav's aesthetic: backdrop blur, accent-tinted icon
 * buttons, and a primary "Upload" CTA that matches the AnimatedButton style.
 *
 * No mobile hamburger: navigation on small screens lives entirely in the
 * bottom MobileNav, so a drawer-trigger here would be redundant clutter.
 */
export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click.
  useEffect(() => {
    if (!showProfileMenu) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showProfileMenu]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/70 backdrop-blur-xl border-b border-[var(--border-color)] px-4 py-3 flex items-center gap-3">
      {/* Global quick-find: live search across pages, FAQs, docs, actions. */}
      <GlobalSearch className="flex-1 max-w-2xl" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/upload")}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white shadow-[0_10px_30px_-12px_var(--accent-glow)]"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          }}
        >
          <Upload size={16} />
          <span>Upload</span>
        </motion.button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
          aria-label="Toggle theme"
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

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[color:var(--accent)] rounded-full ring-2 ring-[var(--bg-primary)]" />
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Open profile menu"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-[color:var(--accent-ring)]"
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] py-1 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
                  >
                    <SettingsIcon size={14} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

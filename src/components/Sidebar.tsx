import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  FileText,
  History,
  FileBarChart,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  // DollarSign,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "./Logo";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Premium sidebar for authenticated pages.
 *
 * - Uses theme-aware `--accent` tokens so it looks right in light + dark.
 * - Active row has a morphing pill indicator powered by layoutId.
 * - Collapses to a 72px rail; icons stay centered, labels fade out.
 * - User card at the bottom so logout is always one click away.
 */
export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const publicLinks = [
    { to: "/", label: "About", icon: Info },
    { to: "/quickstart", label: "Quickstart", icon: Zap },
    // { to: "/pricing", label: "Pricing", icon: DollarSign },
    { to: "/faqs", label: "FAQs", icon: HelpCircle },
  ];

  const authenticatedLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/extracted", label: "Extraction", icon: FileText },
    { to: "/history", label: "History", icon: History },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/dashboards", label: "Dashboards", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/security", label: "Security", icon: Shield },
    { to: "/help", label: "Help", icon: HelpCircle },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border-color)] z-40 hidden md:block overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Brand + collapse */}
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-[var(--border-color)]">
          {!isCollapsed ? (
            <Logo variant="full" size={28} />
          ) : (
            <div className="w-full flex justify-center">
              <Logo variant="mark" size={28} />
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Expand handle when collapsed */}
        {isCollapsed && (
          <button
            onClick={onToggle}
            className="mx-auto mt-3 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((link) => {
            // Exact match, or a nested path like /upload/123 under /upload.
            // Uses a trailing slash to avoid /dashboard matching /dashboards.
            const isActive =
              location.pathname === link.to ||
              (link.to !== "/" &&
                location.pathname.startsWith(link.to + "/"));

            return (
              <NavLink
                key={link.to}
                to={link.to}
                title={isCollapsed ? link.label : undefined}
                className="relative block"
              >
                <div
                  className={`relative flex items-center ${
                    isCollapsed ? "justify-center" : "gap-3 px-3"
                  } h-10 rounded-lg transition-colors ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-lg bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 34,
                      }}
                    />
                  )}
                  <link.icon size={18} className="relative z-10 shrink-0" />
                  {!isCollapsed && (
                    <span className="relative z-10 text-sm font-medium truncate">
                      {link.label}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User card */}
        {isAuthenticated && user && (
          <div className="border-t border-[var(--border-color)] p-3">
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } rounded-xl p-2 hover:bg-[var(--bg-tertiary)] transition-colors`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full ring-2 ring-[color:var(--accent-ring)]"
              />
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    aria-label="Log out"
                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

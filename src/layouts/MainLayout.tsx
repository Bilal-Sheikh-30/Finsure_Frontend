import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { MobileNav } from "../components/MobileNav";
import { ChatWidget } from "../components/chatbot/ChatWidget";

/**
 * Main layout for authenticated pages.
 *
 * - Sidebar collapses independently; main content animates margin to match.
 * - We intentionally DO NOT wrap <Outlet /> in AnimatePresence/motion: that
 *   interacts badly with react-router's outlet context and caused blank
 *   content / crashes on sidebar navigation. Each page animates its own
 *   header in on mount, so route transitions still feel soft.
 */
export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((v) => !v)}
      />

      <div
        className={`transition-[margin] duration-300 ease-out ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Topbar />
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileNav />

      {/* Floating AI assistant - bottom-right across all authenticated pages. */}
      <ChatWidget />
    </div>
  );
};

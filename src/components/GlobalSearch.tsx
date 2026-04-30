import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Upload,
  FileText,
  History,
  FileBarChart,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  BookOpen,
  FileCheck,
  PieChart,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Global quick-search / command palette that lives inside the topbar.
 *
 * Indexes things the FE already owns — no extra API calls — so the input
 * goes from inert decoration to a real productivity surface:
 *
 *   • Pages      — every authenticated route
 *   • FAQs       — hardcoded list mirrored from src/pages/FAQs.tsx
 *   • Docs       — section IDs from src/pages/Documentation.tsx
 *   • Actions    — Toggle theme, Log out, Upload
 *
 * Keyboard model:
 *   ⌘K / Ctrl+K  focus the input from anywhere
 *   ↑ / ↓        move highlight
 *   Enter        activate highlighted result
 *   Esc          close + blur
 *
 * If you want to extend it, push another entry into `staticIndex` below.
 * Categories are inferred from the `kind` field.
 */

type ResultKind = "page" | "faq" | "doc" | "action";

interface SearchItem {
  /** Stable key for React lists. */
  id: string;
  kind: ResultKind;
  label: string;
  description?: string;
  /** Extra terms for matching that shouldn't render as the visible label. */
  keywords?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Either a route to navigate to, or an arbitrary callback. */
  to?: string;
  run?: () => void;
}

const KIND_LABELS: Record<ResultKind, string> = {
  page: "Pages",
  faq: "FAQs",
  doc: "Documentation",
  action: "Actions",
};

// FAQs and doc sections are duplicated here on purpose — keeping the search
// index decoupled from the page components means we can lazy-render those
// pages without pulling them into the topbar bundle.
const PAGES: Omit<SearchItem, "kind">[] = [
  {
    id: "page-overview",
    label: "Overview",
    description: "Your finance home — KPIs and recent activity",
    keywords: "dashboard home stats kpis",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    id: "page-upload",
    label: "Upload",
    description: "Drop bank statements, receipts, invoices",
    keywords: "import file pdf statement",
    icon: Upload,
    to: "/upload",
  },
  {
    id: "page-extracted",
    label: "Extraction",
    description: "Review and edit extracted transactions",
    keywords: "transactions review edit categorize",
    icon: FileText,
    to: "/extracted",
  },
  {
    id: "page-history",
    label: "Upload History",
    description: "Every file you've uploaded",
    keywords: "files past previous",
    icon: History,
    to: "/history",
  },
  {
    id: "page-reports",
    label: "Reports",
    description: "P&L, cash flow, category breakdowns",
    keywords: "pnl profit loss exports csv pdf",
    icon: FileBarChart,
    to: "/reports",
  },
  {
    id: "page-dashboards",
    label: "Dashboards",
    description: "Visual charts and trends",
    keywords: "charts graphs visualize",
    icon: BarChart3,
    to: "/dashboards",
  },
  {
    id: "page-settings",
    label: "Settings",
    description: "Profile, billing, preferences",
    keywords: "account profile billing preferences",
    icon: Settings,
    to: "/settings",
  },
  {
    id: "page-security",
    label: "Security",
    description: "2FA, sessions, audit log",
    keywords: "2fa password sessions audit",
    icon: Shield,
    to: "/security",
  },
  {
    id: "page-help",
    label: "Help Center",
    description: "Get unstuck fast",
    keywords: "support contact",
    icon: HelpCircle,
    to: "/help",
  },
  {
    id: "page-docs",
    label: "Documentation",
    description: "FINSURE handbook",
    keywords: "guide manual reference",
    icon: BookOpen,
    to: "/documentation",
  },
];

const FAQS: Omit<SearchItem, "kind">[] = [
  {
    id: "faq-what-is",
    label: "What is FINSURE?",
    description: "Product overview",
    keywords: "about platform",
    icon: HelpCircle,
    to: "/faqs",
  },
  {
    id: "faq-security",
    label: "How secure is my financial data?",
    description: "AES-256, TLS, 2FA, audit logs",
    keywords: "encryption privacy",
    icon: Shield,
    to: "/faqs",
  },
  {
    id: "faq-formats",
    label: "Which file formats are supported?",
    description: "PDF, JPG, PNG — incl. password-protected PDFs",
    keywords: "pdf jpg png ocr",
    icon: FileText,
    to: "/faqs",
  },
  {
    id: "faq-export",
    label: "Can I export my data?",
    description: "CSV / PDF on every plan; API on Pro+",
    keywords: "csv pdf export api",
    icon: FileBarChart,
    to: "/faqs",
  },
  {
    id: "faq-accuracy",
    label: "How accurate is the extraction?",
    description: "Typical accuracy 95–99%",
    keywords: "ocr llm parser",
    icon: Sparkles,
    to: "/faqs",
  },
  {
    id: "faq-delete",
    label: "How do I delete my account?",
    description: "Settings → Account → Delete",
    keywords: "remove gdpr retention",
    icon: Settings,
    to: "/faqs",
  },
];

// Mirrors the IDs scrolled-to inside Documentation.tsx — using a hash
// fragment lets the page jump straight to the right section.
const DOCS: Omit<SearchItem, "kind">[] = [
  {
    id: "doc-getting-started",
    label: "Getting Started",
    keywords: "intro setup onboarding",
    icon: BookOpen,
    to: "/documentation#getting-started",
  },
  {
    id: "doc-upload",
    label: "Upload Documents",
    keywords: "files pdf",
    icon: Upload,
    to: "/documentation#upload-documents",
  },
  {
    id: "doc-extraction",
    label: "Extraction & Review",
    keywords: "transactions review",
    icon: FileCheck,
    to: "/documentation#extraction-review",
  },
  {
    id: "doc-history",
    label: "Upload History",
    keywords: "files past",
    icon: History,
    to: "/documentation#upload-history",
  },
  {
    id: "doc-reports",
    label: "Generated Reports",
    keywords: "pnl exports",
    icon: FileBarChart,
    to: "/documentation#reports",
  },
  {
    id: "doc-dashboards",
    label: "Visual Dashboards",
    keywords: "charts trends",
    icon: PieChart,
    to: "/documentation#dashboards",
  },
  {
    id: "doc-settings",
    label: "Account Settings",
    keywords: "profile billing",
    icon: Settings,
    to: "/documentation#settings",
  },
  {
    id: "doc-security",
    label: "Security Features",
    keywords: "2fa privacy",
    icon: Shield,
    to: "/documentation#security",
  },
];

/**
 * Highlight matching substring inside a label so users see *why* a result
 * surfaced. Falls back to plain text when there's no match.
 */
const Highlight: React.FC<{ text: string; query: string }> = ({
  text,
  query,
}) => {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-[color:var(--accent)] font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
};

interface GlobalSearchProps {
  /**
   * When true, render results full-width inside a sheet rather than a
   * dropdown — used on small screens where the topbar is space-constrained.
   * Defaults to "auto" responsive behavior via Tailwind classes.
   */
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ className }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Action items pull live state (current theme), so build them inside
  // the component rather than at module scope.
  const actions: Omit<SearchItem, "kind">[] = useMemo(
    () => [
      {
        id: "action-upload",
        label: "Upload a file",
        description: "Jump straight to the upload page",
        keywords: "import statement add new",
        icon: Upload,
        to: "/upload",
      },
      {
        id: "action-theme",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        description: "Toggle the color theme",
        keywords: "theme dark light mode appearance",
        icon: theme === "dark" ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: "action-logout",
        label: "Log out",
        description: "End your session",
        keywords: "signout exit",
        icon: LogOut,
        run: () => {
          logout();
          navigate("/login");
        },
      },
    ],
    [theme, toggleTheme, logout, navigate],
  );

  const index: SearchItem[] = useMemo(
    () => [
      ...PAGES.map((p) => ({ ...p, kind: "page" as const })),
      ...FAQS.map((f) => ({ ...f, kind: "faq" as const })),
      ...DOCS.map((d) => ({ ...d, kind: "doc" as const })),
      ...actions.map((a) => ({ ...a, kind: "action" as const })),
    ],
    [actions],
  );

  // Score = how early the query appears in the searchable text. Lower is
  // better. -1 means no match. Splitting the query on whitespace lets a
  // user type "rep csv" to find Reports + the CSV-export FAQ.
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default surface when the input is open but empty: a curated mix of
      // most-useful destinations so the dropdown isn't a confusing void.
      return [
        index.find((i) => i.id === "page-overview"),
        index.find((i) => i.id === "page-upload"),
        index.find((i) => i.id === "page-extracted"),
        index.find((i) => i.id === "page-reports"),
        index.find((i) => i.id === "action-theme"),
      ].filter(Boolean) as SearchItem[];
    }
    const tokens = trimmed.split(/\s+/);
    const scored: Array<{ item: SearchItem; score: number }> = [];
    for (const item of index) {
      const haystack = `${item.label} ${item.description ?? ""} ${item.keywords ?? ""}`.toLowerCase();
      let total = 0;
      let matchedAll = true;
      for (const token of tokens) {
        const pos = haystack.indexOf(token);
        if (pos === -1) {
          matchedAll = false;
          break;
        }
        total += pos;
      }
      if (matchedAll) scored.push({ item, score: total });
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 12).map((s) => s.item);
  }, [query, index]);

  // Group results by kind for sectioned rendering.
  const grouped = useMemo(() => {
    const out: Record<ResultKind, SearchItem[]> = {
      page: [],
      faq: [],
      doc: [],
      action: [],
    };
    results.forEach((r) => out[r.kind].push(r));
    return out;
  }, [results]);

  const flatOrder: ResultKind[] = ["page", "action", "faq", "doc"];
  const orderedResults = useMemo(
    () => flatOrder.flatMap((k) => grouped[k]),
    [grouped],
  );

  // Reset highlight whenever the visible result list changes shape.
  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  // Track whether the result list has off-screen content so we can render
  // affordances (mirrors the MobileNav pattern: edge fade + bouncing
  // chevron) — important on phones where 4–5 rows is all that fits.
  const updateScrollCue = useCallback(() => {
    const el = listRef.current;
    if (!el) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }
    setCanScrollUp(el.scrollTop > 2);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Defer one tick so refs / layout settle after the panel mounts.
    const id = window.setTimeout(updateScrollCue, 0);
    const el = listRef.current;
    if (el) el.addEventListener("scroll", updateScrollCue, { passive: true });
    window.addEventListener("resize", updateScrollCue);
    return () => {
      window.clearTimeout(id);
      if (el) el.removeEventListener("scroll", updateScrollCue);
      window.removeEventListener("resize", updateScrollCue);
    };
  }, [open, query, updateScrollCue]);

  // Keep the highlighted row visible as the user arrows through results.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const node = el.querySelector<HTMLElement>(
      `[data-result-index='${highlight}']`,
    );
    if (node) node.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const close = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const activate = useCallback(
    (item: SearchItem) => {
      if (item.run) item.run();
      else if (item.to) navigate(item.to);
      setQuery("");
      close();
    },
    [navigate, close],
  );

  // Click-outside closes the dropdown without nuking the query — the user
  // might want to refocus and pick up where they left off.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Cmd+K / Ctrl+K from anywhere focuses the input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) =>
        orderedResults.length === 0 ? 0 : (h + 1) % orderedResults.length,
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) =>
        orderedResults.length === 0
          ? 0
          : (h - 1 + orderedResults.length) % orderedResults.length,
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = orderedResults[highlight];
      if (target) activate(target);
    }
  };

  // Map the absolute highlight index onto each section so we know which
  // row to mark active during render.
  let cursor = 0;
  const sectionRanges: Record<ResultKind, [number, number]> = {
    page: [0, 0],
    action: [0, 0],
    faq: [0, 0],
    doc: [0, 0],
  };
  flatOrder.forEach((k) => {
    const len = grouped[k].length;
    sectionRanges[k] = [cursor, cursor + len];
    cursor += len;
  });

  // Mobile-first sizing knobs:
  //   - The dropdown breaks out slightly past the input wrapper on phones
  //     so the panel uses more of the narrow screen.
  //   - The result list is taller in vh on phones (≈68vh) than desktop
  //     (60vh) because the topbar + on-screen keyboard already eats space.
  //   - Tap targets bump from py-2 → py-3 below md (~48px tall row).
  //   - The ⌘K kbd hint is desktop-only; on mobile we replace it with a
  //     visible "Clear" affordance once a query is typed.
  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      <div className="relative group">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[color:var(--accent)] transition-colors"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search pages, FAQs, actions…"
          aria-label="Global search"
          aria-autocomplete="list"
          aria-expanded={open}
          // pr depends on what's docked on the right: clear button on
          // mobile when typing, ⌘K hint on desktop when idle, nothing
          // otherwise. Keep enough room so the text never clips.
          className={`w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 pl-10 ${query ? "pr-10" : "pr-4 md:pr-16"} py-2.5 rounded-xl border border-[var(--border-color)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all text-sm`}
        />

        {/* Clear button — visible on every screen size so the touch user
            has a tappable way to reset the query without keyboard. */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
          >
            <X size={15} />
          </button>
        )}

        {/* ⌘K hint — desktop only, only when idle. */}
        {!query && !open && (
          <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[10px] font-mono text-[var(--text-secondary)] pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            // -inset-x-2 below md gives the panel a small breakout past
            // the input on narrow screens; on desktop it stays aligned.
            className="absolute -inset-x-2 md:inset-x-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden z-50"
            role="listbox"
          >
            {orderedResults.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                No results for{" "}
                <span className="text-[var(--text-primary)] font-medium">
                  "{query}"
                </span>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={listRef}
                  className="max-h-[68vh] md:max-h-[60vh] overflow-y-auto py-1 no-scrollbar"
                >
                  {flatOrder.map((kind) => {
                    const items = grouped[kind];
                    if (!items.length) return null;
                    const [start] = sectionRanges[kind];
                    return (
                      <div key={kind} className="py-1">
                        <div className="sticky top-0 bg-[var(--bg-secondary)] px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] z-10">
                          {KIND_LABELS[kind]}
                        </div>
                        {items.map((item, i) => {
                          const absoluteIdx = start + i;
                          const isActive = absoluteIdx === highlight;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              data-result-index={absoluteIdx}
                              onMouseEnter={() => setHighlight(absoluteIdx)}
                              onClick={() => activate(item)}
                              role="option"
                              aria-selected={isActive}
                              className={`w-full flex items-center gap-3 px-3 py-3 md:py-2 text-left transition-colors ${
                                isActive
                                  ? "bg-[color:var(--accent-soft)] text-[var(--text-primary)]"
                                  : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]"
                              }`}
                            >
                              <span
                                className={`w-9 h-9 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive
                                    ? "bg-[color:var(--accent)] text-white"
                                    : "bg-[var(--bg-tertiary)] text-[color:var(--accent)]"
                                } transition-colors`}
                              >
                                <Icon size={16} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  <Highlight text={item.label} query={query} />
                                </div>
                                {item.description && (
                                  <div className="text-xs text-[var(--text-secondary)] truncate">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              {isActive && (
                                <span className="hidden md:flex items-center text-[10px] text-[var(--text-secondary)]">
                                  <CornerDownLeft size={12} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Vertical scroll cues — same affordance pattern as the
                    bottom MobileNav so users learn one mental model:
                    edge fade + bouncing chevron whenever there's more
                    content off-screen on that side. */}
                <AnimatePresence>
                  {canScrollUp && (
                    <motion.div
                      key="cue-up"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="pointer-events-none absolute inset-x-0 top-0 h-8 flex items-start justify-center pt-1"
                      style={{
                        background:
                          "linear-gradient(to bottom, var(--bg-secondary) 30%, transparent)",
                      }}
                    >
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-[color:var(--accent)]"
                      >
                        <ChevronUp size={14} />
                      </motion.span>
                    </motion.div>
                  )}
                  {canScrollDown && (
                    <motion.div
                      key="cue-down"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-10 flex items-end justify-center pb-1"
                      style={{
                        background:
                          "linear-gradient(to top, var(--bg-secondary) 30%, transparent)",
                      }}
                    >
                      <motion.span
                        animate={{ y: [0, 2, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-[color:var(--accent)]"
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Footer hint strip — desktop only (the keys it advertises
                don't exist on touch devices, and it crowds the sheet). */}
            <div className="hidden md:flex items-center justify-between gap-3 px-3 py-2 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/50 text-[11px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <ArrowUp size={11} />
                  <ArrowDown size={11} />
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft size={11} />
                  open
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-[var(--border-color)] font-mono text-[10px]">
                    Esc
                  </kbd>
                  close
                </span>
              </div>
              <span className="font-medium text-[var(--text-primary)]">
                FINSURE quick-find
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

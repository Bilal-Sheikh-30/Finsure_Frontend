import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Logo } from "../Logo";
import { GradientOrbs } from "../ui/GradientOrbs";

/**
 * Split-screen auth shell used by Login + Signup.
 *
 * Left pane = marketing / branding (hidden on mobile to keep the form above
 * the fold). Right pane = the form itself, inside a glass card so it floats
 * over the radial backdrop.
 *
 * Form content is passed in via `children` so each page controls its own
 * inputs — the shell just paints the container.
 */
export interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const marketingBullets = [
  {
    icon: ShieldCheck,
    label: "Bank-grade encryption",
    sub: "AES-256 at rest, TLS in transit, 2FA on every account.",
  },
  {
    icon: Zap,
    label: "Statement → insights in seconds",
    sub: "A hybrid rule + LLM pipeline categorizes on ingest.",
  },
  {
    icon: CheckCircle2,
    label: "Works with your bank",
    sub: "Meezan, UBL, Alfalah, Easypaisa and more.",
  },
];

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* ============== LEFT: marketing ============== */}
      <aside className="hidden lg:flex relative flex-1 overflow-hidden border-r border-[var(--border-color)]">
        <GradientOrbs />

        {/* Faint grid */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(var(--border-color)_1px,transparent_1px),linear-gradient(90deg,var(--border-color)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top: brand */}
          <Link to="/" className="inline-flex" aria-label="FINSURE home">
            <Logo variant="inline" size={32} />
          </Link>

          {/* Middle: pitch */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
            >
              <Sparkles size={12} />
              Trusted by finance teams
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              Financial clarity,
              <span className="block bg-gradient-to-r from-[#0ab6ff] via-[#14e7ff] to-[#7af5ff] bg-clip-text text-transparent">
                without the spreadsheet sprawl.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-4 text-lg text-[var(--text-secondary)] max-w-md"
            >
              Upload a statement, get a clean P&L in seconds. Welcome back to
              your numbers.
            </motion.p>

            <div className="mt-10 space-y-5 max-w-md">
              {marketingBullets.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center">
                    <b.icon size={18} className="text-[color:var(--accent)]" />
                  </span>
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">
                      {b.label}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {b.sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom: tiny trust footer */}
          <div className="text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} FINSURE · Crafted with care
          </div>
        </div>
      </aside>

      {/* ============== RIGHT: form ============== */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-10">
        <GradientOrbs className="lg:hidden opacity-70" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          {/* Mobile-only logo (desktop gets it in left pane) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-6">
            <Logo variant="full" size={48} wordmarkClassName="text-3xl" />
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-10 shadow-[0_40px_80px_-30px_var(--accent-glow)]">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                {footer}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

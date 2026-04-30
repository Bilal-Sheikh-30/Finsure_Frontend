import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Shield,
  Zap,
  BarChart3,
  Lock,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Section } from "../components/ui/Section";
import { GradientOrbs } from "../components/ui/GradientOrbs";
import { DemoUploadModal } from "../components/public/DemoUploadModal";

const features = [
  {
    icon: Shield,
    title: "Secure Data Processing",
    description:
      "Bank-grade encryption keeps every transaction private from upload to report.",
  },
  {
    icon: Zap,
    title: "Lightning Fast OCR",
    description:
      "Extract structured data from bank statements and receipts in seconds.",
  },
  {
    icon: BarChart3,
    title: "Visual Dashboards",
    description:
      "Interactive charts surface trends, outliers, and growth at a glance.",
  },
  {
    icon: Lock,
    title: "2FA Authentication",
    description:
      "Hardware-friendly two-factor auth adds a second lock to every login.",
  },
  {
    icon: TrendingUp,
    title: "Smart Categorization",
    description:
      "A rule engine + LLM fallback buckets transactions the way an accountant would.",
  },
  {
    icon: FileCheck,
    title: "Automated Reports",
    description:
      "P&L, cash-flow, and category breakdowns — one click, boardroom-ready.",
  },
];

const stats = [
  { value: "99.2%", label: "Extraction accuracy" },
  { value: "< 4s", label: "Statement → insights" },
  { value: "4+", label: "Banks supported" },
  { value: "0", label: "Spreadsheets needed" },
];

const bullets = [
  "Upload statements from Meezan, UBL, Alfalah, Easypaisa",
  "Auto-categorized with a hybrid rule + LLM pipeline",
  "Export clean CSV or branded PDF reports",
  "Runs on your own Supabase + FastAPI stack",
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);

  return (
    <div className="relative">
      {/* ======================================================== */}
      {/*                        HERO                                */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden">
        <GradientOrbs />

        {/* Faint grid behind the hero — cheap, gives depth without a bg image */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(var(--border-color)_1px,transparent_1px),linear-gradient(90deg,var(--border-color)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20 md:pb-32 text-center">
          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium backdrop-blur-sm"
          >
            <Sparkles size={14} />
            New — AI-powered transaction categorization
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]"
          >
            Financial insights,
            <span className="block mt-2 bg-gradient-to-r from-[#0ab6ff] via-[#14e7ff] to-[#7af5ff] bg-clip-text text-transparent">
              securely delivered.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed"
          >
            FINSURE turns bank statements and receipts into categorized,
            exportable insights. Upload, extract, analyze, and report — all
            with enterprise-grade security.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <AnimatedButton
              size="lg"
              onClick={() => navigate("/signup")}
              trailingIcon={<ArrowRight size={18} />}
            >
              Get started free
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              size="lg"
              onClick={() => setIsDemoOpen(true)}
            >
              Try statement demo
            </AnimatedButton>
          </motion.div>

          {/* Tiny trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[var(--text-secondary)]"
          >
            {bullets.slice(0, 3).map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[color:var(--accent)]" />
                {b}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating hero card — the "product shot" */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl mx-auto px-4 md:px-6 -mt-6 md:-mt-10 pb-20"
        >
          <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl shadow-[0_40px_80px_-30px_rgba(20,231,255,0.25)] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border-color)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-[var(--text-secondary)] font-mono">
                app.finsure.io / dashboard
              </span>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Income", value: "PKR 842,500", tone: "green" },
                { label: "Total Expenses", value: "PKR 361,200", tone: "red" },
                { label: "Net Profit", value: "PKR 481,300", tone: "cyan" },
                { label: "Savings Rate", value: "57.1%", tone: "cyan" },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
                  className="bg-[var(--bg-primary)]/60 rounded-xl p-4 border border-[var(--border-color)]"
                >
                  <div className="text-xs text-[var(--text-secondary)]">
                    {c.label}
                  </div>
                  <div
                    className={`mt-2 text-lg md:text-xl font-semibold ${
                      c.tone === "green"
                        ? "text-green-400"
                        : c.tone === "red"
                          ? "text-red-400"
                          : "text-[color:var(--accent)]"
                    }`}
                  >
                    {c.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mock chart bars */}
            <div className="px-6 md:px-8 pb-8">
              <div className="h-40 flex items-end gap-2">
                {[42, 68, 35, 80, 55, 72, 48, 90, 61, 78, 52, 86].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: reduce ? 0 : 0.8 + i * 0.04,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#0ab6ff]/40 to-[#14e7ff]"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/*                    STATS STRIP                              */}
      {/* ======================================================== */}
      <Section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff] bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="mt-2 text-xs md:text-sm text-[var(--text-secondary)] uppercase tracking-wider">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ======================================================== */}
      {/*                    FEATURE GRID                             */}
      {/* ======================================================== */}
      <Section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[color:var(--accent)] text-sm font-semibold uppercase tracking-[0.2em]">
            Everything you need
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Built for financial clarity
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-secondary)]">
            A focused set of features that replaces spreadsheet chaos with a
            clean, auditable trail from raw statement to polished report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-7 overflow-hidden transition-colors duration-300 hover:border-[color:var(--accent)]/50"
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(20,231,255,0.15),transparent_60%)]"
              />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent-hover)]/10 border border-[color:var(--accent)]/30 flex items-center justify-center">
                  <f.icon className="text-[color:var(--accent)]" size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ======================================================== */}
      {/*                 "WHY FINSURE" CHECKLIST                     */}
      {/* ======================================================== */}
      <Section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[color:var(--accent)] text-sm font-semibold uppercase tracking-[0.2em]">
              Why FINSURE
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              The boring parts, automated.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              You uploaded a PDF. You want clean totals. Everything in between
              — parsing, categorizing, reconciling — is our problem.
            </p>

            <ul className="mt-8 space-y-3">
              {bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="flex items-start gap-3 text-[var(--text-primary)]"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-[color:var(--accent)]/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-[color:var(--accent)]" />
                  </span>
                  <span className="text-sm md:text-base">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <AnimatedButton
                size="md"
                onClick={() => navigate("/signup")}
                trailingIcon={<ArrowRight size={16} />}
              >
                Try it free
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                size="md"
                className="ml-0 mt-3 md:ml-3 md:mt-0"
                onClick={() => setIsDemoOpen(true)}
              >
                Run public demo
              </AnimatedButton>
            </div>
          </div>

          {/* Visual side — animated pipeline diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-8"
          >
            <div className="space-y-4">
              {[
                { step: "01", label: "Upload statement", tone: "#14e7ff" },
                { step: "02", label: "Extract transactions", tone: "#0ab6ff" },
                { step: "03", label: "Categorize with AI", tone: "#14e7ff" },
                { step: "04", label: "Generate insights", tone: "#7af5ff" },
              ].map((p, i) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.45 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)]"
                >
                  <span
                    className="text-xs font-mono font-bold px-2 py-1 rounded"
                    style={{
                      color: p.tone,
                      background: `${p.tone}1a`,
                    }}
                  >
                    {p.step}
                  </span>
                  <span className="flex-1 text-[var(--text-primary)] font-medium">
                    {p.label}
                  </span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <ArrowRight size={16} style={{ color: p.tone }} />
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ======================================================== */}
      {/*                         CTA                                 */}
      {/* ======================================================== */}
      <Section className="max-w-6xl mx-auto px-4 md:px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--accent-hover)]/20 via-[var(--bg-secondary)] to-[color:var(--accent)]/10 p-10 md:p-16 text-center">
          <GradientOrbs className="opacity-50" />

          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)]">
              Ready to ditch the spreadsheets?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
              Upload your first statement in under a minute. Free while you
              kick the tires.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <AnimatedButton
                size="lg"
                onClick={() => navigate("/signup")}
                trailingIcon={<ArrowRight size={18} />}
              >
                Start free trial
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate("/pricing")}
              >
                See pricing
              </AnimatedButton>
            </div>
          </div>
        </div>
      </Section>

      <DemoUploadModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
};

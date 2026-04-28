import React from "react";
import {
  Upload,
  FileText,
  BarChart3,
  FileCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Section } from "../components/ui/Section";
import { GradientOrbs } from "../components/ui/GradientOrbs";

const steps = [
  {
    icon: Upload,
    title: "Upload documents",
    description:
      "Drag & drop a bank statement or receipt. PDF, JPG, PNG — with password-protected PDFs supported.",
    details: [
      "Bulk upload multiple files at once",
      "Automatic file-type detection",
      "Secure encrypted transfer",
    ],
  },
  {
    icon: FileText,
    title: "AI extracts every transaction",
    description:
      "Our parser and categorizer work in seconds. Rule engine first, LLM fallback for the tricky cases.",
    details: [
      "Date, amount, description extraction",
      "Smart category suggestions",
      "Tax-relevant data flagged automatically",
    ],
  },
  {
    icon: BarChart3,
    title: "Review & edit",
    description:
      "Verify extracted data inline. Tweak a category, mark something as taxable — all changes audited.",
    details: [
      "Inline editing",
      "Bulk re-categorization",
      "Merge or split transactions",
    ],
  },
  {
    icon: FileCheck,
    title: "Generate reports",
    description:
      "P&L, cash flow, category breakdowns — one click, export to CSV or branded PDF.",
    details: [
      "Income vs Expense",
      "Cash flow summary with running balance",
      "Category breakdown split by income / expense",
      "Custom date ranges",
    ],
  },
];

export const Quickstart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientOrbs className="opacity-60" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
          >
            <Sparkles size={14} />
            Onboarding in under 5 minutes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Four steps.
            <span className="block bg-gradient-to-r from-[#0ab6ff] via-[#14e7ff] to-[#7af5ff] bg-clip-text text-transparent">
              Clarity by coffee-break.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-xl mx-auto text-lg text-[var(--text-secondary)]"
          >
            From raw PDF statement to polished report — here's exactly how it
            flows.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8"
          >
            <AnimatedButton
              size="lg"
              onClick={() => navigate("/signup")}
              trailingIcon={<ArrowRight size={18} />}
            >
              Start free trial
            </AnimatedButton>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <Section className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <ol className="relative">
          {/* Vertical accent line */}
          <span
            aria-hidden
            className="absolute left-[22px] md:left-[31px] top-4 bottom-4 w-px bg-gradient-to-b from-[color:var(--accent)] via-[color:var(--accent)]/40 to-transparent"
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="relative pl-16 md:pl-24 pb-12 last:pb-0"
            >
              {/* Icon node — solid base so the timeline line doesn't bleed through */}
              <div className="absolute left-0 top-0 w-[46px] h-[46px] md:w-[62px] md:h-[62px] rounded-xl bg-[var(--bg-primary)] border border-[color:var(--accent)]/40 flex items-center justify-center shadow-accent overflow-hidden z-10">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/20 to-[color:var(--accent-hover)]/10"
                />
                <step.icon
                  className="relative text-[color:var(--accent)]"
                  size={22}
                />
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/70 backdrop-blur-sm p-6 md:p-8 transition-colors hover:border-[color:var(--accent)]/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-[color:var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-[var(--border-color)]" />
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>

                <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                  {step.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm text-[var(--text-primary)]/90"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section className="max-w-5xl mx-auto px-4 md:px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--accent-hover)]/15 via-[var(--bg-secondary)] to-[color:var(--accent)]/10 p-10 md:p-14 text-center">
          <GradientOrbs className="opacity-50" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              Ready to try it?
            </h2>
            <p className="mt-3 text-[var(--text-secondary)]">
              Sign up free, upload your first statement, and see your first
              report in minutes.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <AnimatedButton
                size="lg"
                onClick={() => navigate("/signup")}
                trailingIcon={<ArrowRight size={18} />}
              >
                Create free account
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Sign in
              </AnimatedButton>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

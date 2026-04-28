import React, { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Section } from "../components/ui/Section";
import { GradientOrbs } from "../components/ui/GradientOrbs";

type Plan = {
  name: string;
  monthly: number | "custom";
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    description: "For individuals kicking the tires.",
    features: [
      "Up to 10 uploads / month",
      "Basic OCR extraction",
      "Standard reports",
      "Email support",
      "30-day data retention",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    monthly: 29,
    description: "For professionals and small teams.",
    features: [
      "Unlimited uploads",
      "Advanced OCR (99% accuracy)",
      "Custom reports & dashboards",
      "Priority support",
      "Unlimited data retention",
      "API access",
      "Bulk processing",
      "Export to CSV / PDF / JSON",
    ],
    highlighted: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    monthly: "custom",
    description: "For organizations with SSO + SLA needs.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
      "On-prem deployment option",
      "SLA guarantee",
      "Custom training",
      "White-label option",
    ],
    cta: "Contact sales",
  },
];

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  // Yearly toggle is a common expectation on pricing pages; we apply a
  // pretend 20% discount when enabled. Pure UI — the trial flow on /signup
  // handles the actual billing later.
  const [yearly, setYearly] = useState(false);

  return (
    <div className="relative">
      {/* Ambient hero */}
      <section className="relative overflow-hidden">
        <GradientOrbs className="opacity-70" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
          >
            <Sparkles size={14} />
            Simple, transparent pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Pick a plan that
            <span className="block bg-gradient-to-r from-[#0ab6ff] via-[#14e7ff] to-[#7af5ff] bg-clip-text text-transparent">
              grows with you.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 text-lg text-[var(--text-secondary)]"
          >
            Every plan ships with a 14-day free trial. No credit card needed.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]"
          >
            {(["monthly", "yearly"] as const).map((opt) => {
              const active = (opt === "yearly") === yearly;
              return (
                <button
                  key={opt}
                  onClick={() => setYearly(opt === "yearly")}
                  className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                    active
                      ? "text-[#0c111a]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {opt}
                    {opt === "yearly" && (
                      <span className="ml-1.5 text-[10px] font-bold">-20%</span>
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <Section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const priceDisplay =
              plan.monthly === "custom"
                ? "Custom"
                : yearly
                  ? `$${Math.round((plan.monthly as number) * 0.8)}`
                  : `$${plan.monthly}`;
            const periodDisplay =
              plan.monthly === "custom"
                ? "contact sales"
                : yearly
                  ? "/ mo, billed yearly"
                  : "/ month";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-8 transition-colors duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[color:var(--accent-soft)] to-[var(--bg-secondary)] border-2 border-[color:var(--accent)] shadow-accent md:-mt-4"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff] text-[#0c111a] text-xs font-bold tracking-wide">
                      <Sparkles size={12} />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff] bg-clip-text text-transparent">
                    {priceDisplay}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {periodDisplay}
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-[var(--text-primary)]"
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[color:var(--accent-soft)] flex items-center justify-center shrink-0">
                        <Check
                          size={12}
                          className="text-[color:var(--accent)]"
                        />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <AnimatedButton
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="md"
                    className="w-full"
                    onClick={() =>
                      navigate(
                        plan.name === "Enterprise" ? "/faqs" : "/signup"
                      )
                    }
                    trailingIcon={<ArrowRight size={16} />}
                  >
                    {plan.cta}
                  </AnimatedButton>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-[var(--text-secondary)]">
          Prices in USD. Switch or cancel any time. VAT added where applicable.
        </p>
      </Section>

      {/* Compare teaser */}
      <Section className="max-w-4xl mx-auto px-4 md:px-6 pb-24">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Need a tailored plan?
          </h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            For finance teams, multiple entities, or on-prem deployments, we'll
            shape a plan that fits.
          </p>
          <div className="mt-6 flex justify-center">
            <AnimatedButton
              variant="secondary"
              size="md"
              onClick={() => navigate("/faqs")}
            >
              Talk to us
            </AnimatedButton>
          </div>
        </div>
      </Section>
    </div>
  );
};

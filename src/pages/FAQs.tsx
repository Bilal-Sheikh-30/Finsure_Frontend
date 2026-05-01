import React, { useState } from "react";
import { Plus, Minus, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../components/ui/Section";
import { GradientOrbs } from "../components/ui/GradientOrbs";
import { AnimatedButton } from "../components/ui/AnimatedButton";

const faqs = [
  {
    category: "Product",
    question: "What is FINSURE?",
    answer:
      "FINSURE is a financial workflow platform that turns raw documents - bank statements, receipts, invoices - into clean, categorized, exportable insights. Upload, review, report.",
  },
  {
    category: "Security",
    question: "How secure is my financial data?",
    answer:
      "We use AES-256 encryption at rest and TLS in transit. Passwords are hashed, 2FA is available on every account, and audit logs capture every mutation.",
  },
  {
    category: "Product",
    question: "Which file formats are supported?",
    answer:
      "PDF, JPG, and PNG. We handle password-protected PDFs (Meezan-style) and native-text PDFs as well as scanned images through our OCR path.",
  },
  {
    category: "Product",
    question: "Can I export my data?",
    answer:
      "Yes. CSV and PDF exports live on every plan. Pro and Enterprise add API access and JSON export for integrations.",
  },
  {
    category: "Accuracy",
    question: "How accurate is the extraction?",
    answer:
      "Typical accuracy sits between 95–99%. Every extracted transaction is fully editable before it lands in your reports - and a hybrid rule + LLM categorizer keeps buckets sensible.",
  },
  {
    category: "Account",
    question: "How do I delete my account?",
    answer:
      "From Settings → Account → Delete. All data is permanently removed within 30 days per our retention policy. No dark patterns, no hoops.",
  },
];

export const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientOrbs className="opacity-60" />
        <div className="relative max-w-3xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
          >
            <Sparkles size={14} />
            Got questions? We got answers.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Frequently asked,
            <span className="block bg-gradient-to-r from-[#0ab6ff] via-[#14e7ff] to-[#7af5ff] bg-clip-text text-transparent">
              plainly answered.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-4 text-lg text-[var(--text-secondary)]"
          >
            The short answers to the most common things people ask.
          </motion.p>
        </div>
      </section>

      {/* Accordion */}
      <Section className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-2xl border bg-[var(--bg-secondary)]/60 backdrop-blur-sm overflow-hidden transition-colors ${
                  isOpen
                    ? "border-[color:var(--accent)]/50"
                    : "border-[var(--border-color)] hover:border-[color:var(--accent)]/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    {faq.category}
                  </span>
                  <h3 className="flex-1 text-base md:text-lg font-semibold text-[var(--text-primary)]">
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[color:var(--accent)] shrink-0"
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 pt-1 text-[var(--text-secondary)] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="max-w-3xl mx-auto px-4 md:px-6 pb-28">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[color:var(--accent-soft)] flex items-center justify-center">
            <MessageCircle className="text-[color:var(--accent)]" size={22} />
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Still stuck?
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            Our team replies within one business day. Usually faster.
          </p>
          <div className="mt-6">
            <AnimatedButton
              size="md"
              onClick={() =>
                (window.location.href = "mailto:support@finsure.app")
              }
            >
              Contact support
            </AnimatedButton>
          </div>
        </div>
      </Section>
    </div>
  );
};

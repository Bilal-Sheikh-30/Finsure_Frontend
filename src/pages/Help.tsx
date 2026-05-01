import React from "react";
import { Mail, Book, ExternalLink, Sparkles, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { LiveChatCard } from "../components/chatbot/LiveChatCard";

const SUPPORT_CARDS = [
  {
    icon: Book,
    title: "Documentation",
    desc: "Browse comprehensive guides, tutorials, and API references.",
    cta: "View docs",
    href: "/documentation",
    external: true,
  },
  {
    icon: Mail,
    title: "Email support",
    desc: "Write us and we'll get back within one business day.",
    cta: "support@finsure.com",
    href: "mailto:support@finsure.com",
    external: false,
  },
  {
    icon: HelpCircle,
    title: "Frequently asked",
    desc: "Quick answers to the most common questions.",
    cta: "Browse FAQs",
    href: "/faqs",
    external: true,
  },
];

export const Help: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
        >
          <Sparkles size={12} />
          We reply fast
        </motion.div>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Help &amp; support
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          Ask the AI, read the docs, or drop us a line - whichever's faster.
        </p>
      </div>

      {/* Live chat spotlight + support cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-3 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-[0_6px_18px_-6px_var(--accent-glow)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              }}
            >
              <MessageCircle size={15} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Live chat
                <span className="ml-1.5 text-[var(--text-secondary)] font-normal">
                  · FINSURE Assistant
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online · instant replies
              </p>
            </div>
          </div>
          <LiveChatCard />
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
          {SUPPORT_CARDS.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -2 }}
              className="block bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[color:var(--accent)]/60 hover:shadow-[0_16px_32px_-20px_var(--accent-glow)] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center mb-3">
                <c.icon className="text-[color:var(--accent)]" size={20} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                {c.title}
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-3 leading-relaxed">
                {c.desc}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent)] group-hover:text-[color:var(--accent-hover)]">
                {c.cta}
                {c.external && <ExternalLink size={13} />}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

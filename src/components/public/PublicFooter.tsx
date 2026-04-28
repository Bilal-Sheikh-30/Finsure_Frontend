import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Logo } from "../Logo";

const columns: Array<{
  heading: string;
  links: Array<{ label: string; to: string }>;
}> = [
  {
    heading: "Product",
    links: [
      { label: "Overview", to: "/" },
      { label: "Pricing", to: "/pricing" },
      { label: "Quickstart", to: "/quickstart" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Blog", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", to: "/" },
      { label: "Security", to: "/" },
      { label: "Changelog", to: "/" },
      { label: "Status", to: "/" },
    ],
  },
];

const socials = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@finsure.app", label: "Email" },
];

export const PublicFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* Soft gradient wash above the footer adds depth without a hard seam */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[var(--bg-primary)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="col-span-2">
            <Logo variant="inline" size={30} />
            <p className="mt-4 text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
              Turn financial documents into actionable insights. Built for
              freelancers and businesses who want clarity without the
              spreadsheet sprawl.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]/50 hover:bg-[color:var(--accent-soft)] transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-wider uppercase">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-[var(--text-secondary)] hover:text-[color:var(--accent)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} FINSURE. Crafted with care.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
            <Link to="/" className="hover:text-[color:var(--accent)] transition-colors">
              Privacy
            </Link>
            <Link to="/" className="hover:text-[color:var(--accent)] transition-colors">
              Terms
            </Link>
            <Link to="/" className="hover:text-[color:var(--accent)] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

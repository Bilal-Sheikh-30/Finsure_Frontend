import React, { useState } from "react";
import {
  BookOpen,
  Upload,
  FileCheck,
  History,
  BarChart3,
  PieChart,
  Settings,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import dashboard from "../assets/dashboard.webp";
import dashboards from "../assets/dashboards.webp";
import extraction from "../assets/extraction.webp";
import history from "../assets/history.webp";
import reports from "../assets/reports.webp";
import security from "../assets/security.jpeg";
import settings from "../assets/settings.jpeg";
import upload from "../assets/upload.webp";

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("getting-started");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: BookOpen },
    { id: "upload-documents", title: "Upload Documents", icon: Upload },
    { id: "extraction-review", title: "Extraction & Review", icon: FileCheck },
    { id: "upload-history", title: "Upload History", icon: History },
    { id: "reports", title: "Generated Reports", icon: BarChart3 },
    { id: "dashboards", title: "Visual Dashboards", icon: PieChart },
    { id: "settings", title: "Account Settings", icon: Settings },
    { id: "security", title: "Security Features", icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 md:p-10 mb-10 text-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-70"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 65%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium">
            <Sparkles size={12} />
            Documentation
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            FINSURE handbook
          </h1>
          <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Everything you need to upload statements, review extractions, and
            make sense of your financial data - in one place.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-3 sticky top-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-2 pt-1 pb-2">
              On this page
            </h3>
            <nav className="space-y-1 relative">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="relative w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
                  >
                    {active && (
                      <motion.span
                        layoutId="doc-nav-pill"
                        className="absolute inset-0 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative flex items-center gap-3 ${
                        active
                          ? "text-[color:var(--accent)]"
                          : "text-[var(--text-primary)] hover:text-[color:var(--accent)]"
                      }`}
                    >
                      <Icon size={16} />
                      {section.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Getting Started */}
          <section
            id="getting-started"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <BookOpen className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Getting Started
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  What is FINSURE?
                </h3>
                <p className="leading-relaxed mb-4">
                  FINSURE is an intelligent financial management platform
                  designed specifically for freelancers and small business
                  owners. It automates the tedious process of organizing and
                  analyzing financial data by extracting information from
                  receipts, invoices, bank statements, and payment screenshots
                  using advanced OCR (Optical Character Recognition) and NLP
                  (Natural Language Processing) technologies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Multi-format document processing supporting PDF, JPG, PNG,
                      and HEIC files
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>Automated data extraction with 95-99% accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Intelligent transaction categorization (Income, Expenses,
                      Client Payments)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Automated financial report generation (Income vs Expenses,
                      Cash Flow, P&L)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Taxable vs Non-taxable income classification for tax
                      compliance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Interactive visual dashboards powered by Apache Superset
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      Bank-grade security with Two-Factor Authentication
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Dashboard Overview
                </h3>
                <p className="leading-relaxed mb-3">
                  After logging in, you will see your Dashboard Overview with
                  key financial metrics at a glance:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      <strong>Total Income:</strong> Sum of all income
                      transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      <strong>Total Expenses:</strong> Sum of all expense
                      transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      <strong>Net Profit:</strong> Calculated difference between
                      income and expenses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={18}
                    />
                    <span>
                      <strong>Taxable Income:</strong> Automatically classified
                      taxable income amount
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img
                    src={dashboard}
                    alt="Dashboard Overview"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Dashboard Overview with financial
                      summary cards
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Documents */}
          <section
            id="upload-documents"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <Upload className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Upload Documents
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  How to Upload Financial Documents
                </h3>
                <p className="leading-relaxed mb-4">
                  The Upload page allows you to submit your financial documents
                  for automatic data extraction. Follow these steps:
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Step 1: Navigate to Upload
                    </h4>
                    <p>
                      Click on the <strong>Upload</strong> option in the left
                      sidebar, or use the <strong>Upload</strong> button in the
                      top-right corner of any page.
                    </p>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Step 2: Select Your Files
                    </h4>
                    <p>You have two options to upload files:</p>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Drag and Drop:</strong> Drag your files
                          directly into the upload area
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Click to Browse:</strong> Click anywhere in
                          the upload area to open your file browser
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Step 3: Supported File Formats
                    </h4>
                    <p className="mb-2">
                      FINSURE accepts the following file formats:
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>PDF</strong> - Digital or scanned PDFs of
                          invoices, bank statements, receipts
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>JPG/JPEG</strong> - Photos of receipts or
                          payment screenshots
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>PNG</strong> - Screenshots of digital
                          transactions or receipts
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>HEIC</strong> - iPhone photos of receipts or
                          documents
                        </span>
                      </li>
                    </ul>
                    <p className="mt-2">
                      <strong>Note:</strong> Maximum file size is 10MB per file.
                    </p>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Step 4: Processing
                    </h4>
                    <p>Once uploaded, FINSURE will:</p>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>Scan the file for security threats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Apply OCR to extract text and financial data
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Analyze layout to identify transaction tables and key
                          fields
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Categorize transactions automatically using NLP
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Store validated data in your secure database
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={upload}
                    alt="Upload Documents Interface"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Upload Documents interface with the
                      drag-and-drop area summary cards
                    </em>
                  </p>
                </div>
              </div>

              <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 rounded-lg p-4">
                <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                  💡 Tips for Best Results
                </h4>
                <ul className="space-y-2 ml-4 text-[var(--text-primary)] opacity-80">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Ensure documents are clear and readable (avoid blurry
                      photos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Use good lighting when photographing physical receipts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Keep documents flat and avoid shadows or creases
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Upload multiple documents at once for batch processing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Extraction Review */}
          <section
            id="extraction-review"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <FileCheck className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Extraction and Review
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Review Extracted Transaction Data
                </h3>
                <p className="leading-relaxed mb-4">
                  After uploading documents, FINSURE automatically extracts
                  transaction data. The Extraction Review page allows you to
                  verify and edit this information before finalizing it.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Understanding the Extraction Table
                    </h4>
                    <p className="mb-2">
                      The table displays all extracted transactions with the
                      following columns:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Date:</strong> Transaction date (format:
                          YYYY-MM-DD)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Description:</strong> Transaction description
                          or payee/payer name
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Amount:</strong> Transaction amount (green for
                          income, red for expenses)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Category:</strong> Auto-assigned category
                          (income, rent, software, utilities, etc.)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Taxable:</strong> Whether the transaction is
                          taxable (Yes/No)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Actions:</strong> Edit icon to modify
                          transaction details
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      How to Edit Transactions
                    </h4>
                    <ol className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          1.
                        </span>
                        <span>
                          Click the <strong>edit icon (pencil)</strong> in the
                          Actions column for any transaction
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          2.
                        </span>
                        <span>
                          Modify any field: date, description, amount, category,
                          or taxable status
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          3.
                        </span>
                        <span>
                          Click <strong>Save Changes</strong> button to apply
                          your edits
                        </span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Export Options
                    </h4>
                    <p className="mb-2">
                      Once you have reviewed the data, you can:
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Export CSV:</strong> Download all transactions
                          as a CSV file for use in Excel or other tools
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Save Changes:</strong> Finalize and store the
                          transactions in your database
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={extraction}
                    alt="Extraction Review Interface"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Extraction Review page with
                      transaction table and edit options summary cards
                    </em>
                  </p>
                </div>
              </div>

              <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 rounded-lg p-4">
                <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                  ⚡ Quick Actions
                </h4>
                <ul className="space-y-2 ml-4 text-[var(--text-primary)] opacity-80">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Always review extracted data for accuracy, especially
                      amounts and dates
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Verify category assignments to ensure accurate reporting
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Check taxable status for tax compliance purposes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Upload History */}
          <section
            id="upload-history"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <History className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Upload History
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Manage Your Uploaded Documents
                </h3>
                <p className="leading-relaxed mb-4">
                  The Upload History page provides a comprehensive view of all
                  documents you have uploaded to FINSURE, their processing
                  status, and extracted transaction summaries.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Document Cards
                    </h4>
                    <p className="mb-2">
                      Each uploaded document is displayed as a card showing:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Filename:</strong> Original name of the
                          uploaded file
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Upload Date and Time:</strong> When the
                          document was uploaded
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Transaction Count:</strong> Number of
                          transactions extracted from the document
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Total Amount:</strong> Sum of all transaction
                          amounts in the document
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Document Type Badge:</strong> Category label
                          (invoice, receipt, bank statement)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Status Badge:</strong> Processing status
                          (processing, completed, failed)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Processing Status
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong className="text-yellow-500">
                            Processing:
                          </strong>{" "}
                          Document is currently being analyzed
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong className="text-green-500">Completed:</strong>{" "}
                          Extraction finished successfully, data available for
                          review
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong className="text-red-500">Failed:</strong>{" "}
                          Processing error occurred (try re-uploading)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Filtering and Pagination
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Filters:</strong> Use the Filters button to
                          sort by document type, date range, or status
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Pagination:</strong> Navigate through pages
                          using Previous/Next buttons at the bottom
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={history}
                    alt="History Overview"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Upload History page with document
                      cards and status indicators summary cards
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Generated Reports */}
          <section
            id="reports"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <BarChart3 className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Generated Reports
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  View and Download Financial Reports
                </h3>
                <p className="leading-relaxed mb-4">
                  FINSURE automatically generates professional financial reports
                  based on your uploaded and categorized transactions. These
                  reports provide clear insights into your financial
                  performance.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Available Report Types
                    </h4>
                    <ul className="ml-4 space-y-3">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <div>
                          <strong>Income vs Expense Report:</strong>
                          <p className="text-sm mt-1">
                            Compares total income against total expenses for a
                            specified period, showing net profit or loss
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <div>
                          <strong>Tax Summary Report:</strong>
                          <p className="text-sm mt-1">
                            Breaks down taxable vs non-taxable income to
                            simplify tax filing and compliance
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <div>
                          <strong>Cash Flow Analysis:</strong>
                          <p className="text-sm mt-1">
                            Tracks money flow in and out of your business over
                            time, identifying trends and patterns
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <div>
                          <strong>
                            Profit and Loss Statement (Simplified):
                          </strong>
                          <p className="text-sm mt-1">
                            A simplified P&L showing revenue, expenses, and
                            profitability without complex accounting jargon
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      How to Access Reports
                    </h4>
                    <ol className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          1.
                        </span>
                        <span>
                          Navigate to the <strong>Reports</strong> page from the
                          sidebar
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          2.
                        </span>
                        <span>
                          Browse available reports displayed as cards with
                          generation date and period
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          3.
                        </span>
                        <span>
                          Click <strong>View Report</strong> to open and review
                          the report
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          4.
                        </span>
                        <span>
                          Use the <strong>share icon</strong> to download or
                          share reports
                        </span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Generate New Reports
                    </h4>
                    <ol className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          1.
                        </span>
                        <span>
                          Click the <strong>+ Generate Report</strong> button
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          2.
                        </span>
                        <span>Select report type and date range</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          3.
                        </span>
                        <span>
                          System will automatically compile data and generate a
                          downloadable PDF
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={reports}
                    alt="Generated Reports Interface"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Generated Reports page with report
                      cards and view options
                    </em>
                  </p>
                </div>
              </div>

              <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 rounded-lg p-4">
                <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                  📊 Report Benefits
                </h4>
                <ul className="space-y-2 ml-4 text-[var(--text-primary)] opacity-80">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Professional, structured format suitable for banks,
                      investors, or accountants
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Clear visualizations make financial data easy to
                      understand at a glance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Downloadable PDF format for offline storage and sharing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Visual Dashboards */}
          <section
            id="dashboards"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <PieChart className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Visual Dashboards
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Interactive Financial Visualizations
                </h3>
                <p className="leading-relaxed mb-4">
                  The Dashboards page provides interactive charts and graphs
                  powered by Apache Superset, enabling you to visualize your
                  financial health and identify trends at a glance.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Monthly Income vs Expenses Chart
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Bar chart comparing income and expenses month-by-month
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Hover over bars to see exact amounts for each month
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Quickly identify months with highest expenses or
                          income
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Color-coded: cyan for income, dark blue for expenses
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Cash Flow Trend Line
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Line chart showing cash flow trends over weekly
                          periods
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Identifies peak cash flow periods and potential cash
                          shortages
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Useful for forecasting and planning future expenses
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Interactive points show exact values for each week
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Apache Superset Integration
                    </h4>
                    <p className="mb-2">For advanced analytics:</p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Click <strong>Connect to Apache Superset</strong> to
                          access full dashboard suite
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Create custom dashboards with drag-and-drop interface
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Build complex queries and analytics on your financial
                          data
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Share interactive dashboards with team members or
                          advisors
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      How to Use Dashboards
                    </h4>
                    <ol className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          1.
                        </span>
                        <span>
                          Navigate to <strong>Dashboards</strong> from the
                          sidebar
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          2.
                        </span>
                        <span>
                          View built-in charts that update automatically as you
                          add transactions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          3.
                        </span>
                        <span>
                          Hover over chart elements for detailed breakdowns
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[color:var(--accent)] font-semibold flex-shrink-0">
                          4.
                        </span>
                        <span>
                          Use time range selectors to view data for specific
                          periods
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={dashboards}
                    alt="Dashboard Interface"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Visual Dashboards page with
                      interactive charts
                    </em>
                  </p>
                </div>
              </div>

              <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 rounded-lg p-4">
                <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                  💡 Dashboard Tips
                </h4>
                <ul className="space-y-2 ml-4 text-[var(--text-primary)] opacity-80">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Check dashboards regularly to spot spending patterns and
                      anomalies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Use cash flow trends to plan for seasonal business
                      variations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>
                      Export charts as images for presentations or reports
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section
            id="settings"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <Settings className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Account Settings
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Manage Your Profile and Preferences
                </h3>
                <p className="leading-relaxed mb-4">
                  The Settings page allows you to customize your account
                  information, notification preferences, and data privacy
                  settings.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Profile Information
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Full Name:</strong> Update your display name
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Email:</strong> Change your account email
                          address
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Profile Photo:</strong> Upload or change your
                          profile picture
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Click <strong>Save Changes</strong> after making edits
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Security Settings
                    </h4>
                    <p className="mb-2">
                      Access security options from the sidebar:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Change Password:</strong> Update your account
                          password
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Two-Factor Authentication:</strong> Enable 2FA
                          for extra security
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Active Sessions:</strong> View and manage
                          logged-in devices
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Notification Preferences
                    </h4>
                    <p className="mb-2">
                      Customize how and when you receive alerts:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Email notifications for new report generation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>Alerts when document processing completes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>Weekly financial summary emails</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Data and Privacy
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Export Data:</strong> Download all your
                          financial data in CSV or JSON format
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Data Retention:</strong> Configure how long to
                          keep transaction data
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Delete Account:</strong> Permanently remove
                          your account and all associated data
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <img
                    src={settings}
                    alt="Settings Interface"
                    className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                  />

                  <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                    <em>
                      Screenshot Reference: Settings page with profile
                      information section
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section
            id="security"
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 scroll-mt-6 hover:border-[color:var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-hover)]">
                <Shield className="text-white" size={22} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                Security Features
              </h2>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] opacity-80">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  Your Data Security is Our Priority
                </h3>
                <p className="leading-relaxed mb-4">
                  FINSURE implements multiple layers of security to protect your
                  sensitive financial information at every stage of processing.
                </p>

                <div className="space-y-4">
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="mb-2">
                      Add an extra layer of protection to your account:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Go to <strong>Security</strong> in the sidebar
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Click <strong>Enable 2FA</strong> button
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Scan QR code with your authenticator app (Google
                          Authenticator, Authy, etc.)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>Enter verification code to confirm setup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Future logins will require both password and 6-digit
                          code
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Active Session Management
                    </h4>
                    <p className="mb-2">
                      Monitor and control all devices accessing your account:
                    </p>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          View all active sessions with device and location
                          information
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>Current session is clearly marked as Active</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Instantly log out suspicious or unauthorized sessions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Receive notifications when new devices access your
                          account
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Data Encryption and Privacy
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Encryption at Rest:</strong> All stored data
                          is encrypted using AES-256 bank-grade encryption
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Encryption in Transit:</strong> All data
                          transmission uses TLS/SSL protocols
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>File Scanning:</strong> Uploaded files are
                          automatically scanned for malware and threats
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>Isolated Processing:</strong> OCR runs in a
                          secure, sandboxed environment
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          <strong>No Raw Data Exposure:</strong> Only summarized
                          insights are shared through dashboards
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Compliance and Standards
                    </h4>
                    <ul className="ml-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Compliance with industry-standard data protection
                          practices
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Regular security audits and vulnerability assessments
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Role-based access control to restrict unauthorized
                          access
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight
                          className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span>
                          Strict internal policies for employee data access
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="mt-6">
                    <img
                      src={security}
                      alt="Security Settings Interface"
                      className="w-full max-w-3xl mx-auto rounded-lg border border-[var(--border-color)] shadow-md"
                    />

                    <p className="leading-relaxed mt-3 text-center text-sm opacity-70">
                      <em>
                        Screenshot Reference: Security settings page with 2FA
                        and active sessions
                      </em>
                    </p>
                  </div>
                </div>

                <div className="bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 rounded-lg p-4">
                  <h4 className="font-semibold text-[color:var(--accent)] mb-2">
                    🔐 Security Best Practices
                  </h4>
                  <ul className="space-y-2 ml-4 text-[var(--text-primary)] opacity-80">
                    <li className="flex items-start gap-2">
                      <ChevronRight
                        className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                        size={16}
                      />
                      <span>
                        Enable Two-Factor Authentication for maximum account
                        protection
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight
                        className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                        size={16}
                      />
                      <span>
                        Use a strong, unique password for your account
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight
                        className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                        size={16}
                      />
                      <span>Log out from shared or public devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight
                        className="text-[color:var(--accent)] flex-shrink-0 mt-1"
                        size={16}
                      />
                      <span>
                        Regularly review active sessions and revoke unfamiliar
                        ones
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

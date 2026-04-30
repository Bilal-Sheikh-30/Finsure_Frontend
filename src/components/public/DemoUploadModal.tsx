import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  FileText,
  Landmark,
  Loader,
  Sparkles,
  Upload as UploadIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Bank,
  DemoStatementResult,
  banksApi,
  demoApi,
} from "../../services/apiClient";
import { toast } from "../../utils/toast";
import { AnimatedButton } from "../ui/AnimatedButton";

const ACCEPTED_MIME = ["application/pdf"];

interface DemoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoUploadModal: React.FC<DemoUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    setIsLoadingBanks(true);
    banksApi
      .getAll()
      .then(setBanks)
      .catch(() => {
        setBanks([]);
        toast.error("Failed to load supported banks");
      })
      .finally(() => setIsLoadingBanks(false));

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setSelectedBank("");
      setPassword("");
      setShowPassword(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  const selectedBankMeta = banks.find((bank) => bank.slug === selectedBank);
  const selectedBankNeedsPassword =
    !!selectedBankMeta &&
    (selectedBankMeta.requiresPassword || selectedBankMeta.slug === "alfalah");

  const setSingleFile = (incoming: File[]) => {
    if (incoming.length === 0) return;
    if (incoming.length > 1) {
      toast.error("Please upload exactly one statement for the demo");
      return;
    }

    const nextFile = incoming[0];
    if (!ACCEPTED_MIME.includes(nextFile.type)) {
      toast.error("The public demo currently supports PDF statements only");
      return;
    }

    setFile(nextFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a statement");
      return;
    }
    if (!selectedBankMeta) {
      toast.error("Please choose a bank");
      return;
    }
    if (selectedBankNeedsPassword && !password.trim()) {
      toast.error("A statement password is required for this bank");
      return;
    }

    setIsSubmitting(true);
    try {
      const result: DemoStatementResult = await demoApi.uploadStatement(
        file,
        {
          slug: selectedBankMeta.slug,
          isMobileWallet: selectedBankMeta.isMobileWallet,
        },
        selectedBankNeedsPassword ? password : null
      );

      onClose();
      navigate("/demo/results", {
        state: {
          result,
        },
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Failed to process your demo statement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[61] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 md:p-6">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col rounded-[28px] border border-[var(--accent-ring)] bg-[var(--bg-primary)] shadow-[0_36px_90px_-28px_rgba(20,231,255,0.35)] md:max-h-[calc(100vh-3rem)]"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] px-6 py-5">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--accent)]">
                      <Sparkles size={12} />
                      Public demo
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                      Try statement extraction live
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Upload one PDF statement and we&apos;ll show extraction,
                      categorization, and a category breakdown report without
                      saving anything.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    aria-label="Close demo upload modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      setSingleFile(Array.from(e.dataTransfer.files));
                    }}
                    className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${
                      isDragging
                        ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                        : "border-[color:var(--accent-ring)] bg-[var(--bg-secondary)]/65 hover:border-[color:var(--accent)]"
                    }`}
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0ab6ff] to-[#14e7ff] text-[#0c111a]">
                      <UploadIcon size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                      {file ? file.name : "Drop one PDF or click to browse"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Demo currently supports one PDF bank statement at a time.
                    </p>
                    {file && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        <FileText size={13} />
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) =>
                        setSingleFile(e.target.files ? Array.from(e.target.files) : [])
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                        <Landmark size={15} className="text-[color:var(--accent)]" />
                        Bank
                      </span>
                      <select
                        value={selectedBank}
                        onChange={(e) => {
                          setSelectedBank(e.target.value);
                          setPassword("");
                          setShowPassword(false);
                        }}
                        disabled={isLoadingBanks || isSubmitting}
                        className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--accent)]"
                      >
                        <option value="">
                          {isLoadingBanks ? "Loading banks..." : "Select bank"}
                        </option>
                        {banks.map((bank) => (
                          <option key={bank.id} value={bank.slug}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                        Password
                      </span>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={!selectedBankNeedsPassword || isSubmitting}
                          placeholder={
                            selectedBankNeedsPassword
                              ? "Statement password"
                              : "Not required for this bank"
                          }
                          className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 pr-11 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        {selectedBankNeedsPassword && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors hover:text-[color:var(--accent)]"
                            aria-label={
                              showPassword ? "Hide statement password" : "Show statement password"
                            }
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 p-4 text-sm text-[var(--text-secondary)]">
                    We reuse the same bank list and extraction pipeline as the main
                    product, but demo uploads are processed in memory only and are
                    not saved to your database.
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[var(--border-color)] px-6 py-5 sm:flex-row">
                  <AnimatedButton
                    variant="secondary"
                    size="md"
                    className="sm:flex-1"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    size="md"
                    className="sm:flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    trailingIcon={
                      isSubmitting ? <Loader size={16} className="animate-spin" /> : undefined
                    }
                  >
                    {isSubmitting ? "Processing demo" : "Run demo"}
                  </AnimatedButton>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  File,
  X,
  CheckCircle,
  Loader,
  Eye,
  EyeOff,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadApi, banksApi, Bank } from "../services/apiClient";
import { toast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "../components/ui/AnimatedButton";

const ACCEPTED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
];

export const Upload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileBanks, setFileBanks] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePasswords, setFilePasswords] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    banksApi.getAll().then(setBanks).catch(() => setBanks([]));
  }, []);

  const bankBySlug = (slug: string) => banks.find((b) => b.slug === slug);

  const addFiles = (incoming: File[]) => {
    const accepted = incoming.filter((f) => ACCEPTED_MIME.includes(f.type));
    if (accepted.length === 0) {
      toast.error("Please upload PDF, JPG, PNG, or HEIC files only");
      return;
    }
    setFiles((prev) => [...prev, ...accepted]);
    toast.success(`${accepted.length} file${accepted.length > 1 ? "s" : ""} added`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    setFiles(files.filter((_, i) => i !== index));
    const newFileBanks = { ...fileBanks };
    delete newFileBanks[fileName];
    setFileBanks(newFileBanks);
    const newPasswords = { ...filePasswords };
    delete newPasswords[fileName];
    setFilePasswords(newPasswords);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    const missingBanks = files.filter((file) => !fileBanks[file.name]);
    if (missingBanks.length > 0) {
      toast.error("Please choose a bank for every file");
      return;
    }
    const missingPasswords = files.filter((file) => {
      const bank = bankBySlug(fileBanks[file.name]);
      return bank?.requiresPassword && !filePasswords[file.name];
    });
    if (missingPasswords.length > 0) {
      toast.error("A statement password is required for the selected bank(s)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      for (let i = 0; i < files.length; i++) {
        const bank = bankBySlug(fileBanks[files[i].name]);
        if (!bank) continue;
        await uploadApi.uploadStatement(
          files[i],
          { slug: bank.slug, isMobileWallet: bank.isMobileWallet },
          bank.requiresPassword ? filePasswords[files[i].name] : null,
        );
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      toast.success("Files uploaded successfully");
      setTimeout(() => navigate("/history"), 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
        >
          <Sparkles size={12} />
          Hybrid OCR + LLM pipeline
        </motion.div>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Upload documents
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          Drop bank statements, invoices, or receipts. We'll extract, categorize,
          and stage them for review in seconds.
        </p>
      </div>

      {/* Dropzone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDragging) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative overflow-hidden bg-[var(--bg-secondary)] border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer group transition-colors ${
          isDragging
            ? "border-[color:var(--accent)]"
            : "border-[color:var(--accent-ring)] hover:border-[color:var(--accent)]"
        }`}
      >
        {/* Soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--accent-soft)] via-transparent to-transparent opacity-60"
        />
        {/* Dotted grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(var(--accent) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <motion.div
          animate={{ y: isDragging ? -6 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-[0_14px_32px_-10px_var(--accent-glow)]"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
          }}
        >
          <UploadIcon size={28} />
        </motion.div>
        <h3 className="relative mt-5 text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
          {isDragging ? "Drop to upload" : "Drop files here or click to browse"}
        </h3>
        <p className="relative mt-1.5 text-sm text-[var(--text-secondary)]">
          PDF, JPG, PNG, HEIC · up to 10 MB per file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* Bank chips + trust line */}
      {banks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-2xl p-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
              <Landmark className="w-4 h-4 text-[color:var(--accent)]" />
              Supported banks
            </span>
            {banks.map((b) => (
              <span
                key={b.id}
                className="px-2.5 py-1 rounded-full bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] text-[color:var(--accent)] text-xs font-medium"
              >
                {b.name}
              </span>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <ShieldCheck size={14} className="text-emerald-500" />
            Encrypted end-to-end
          </div>
        </motion.div>
      )}

      {/* Selected files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Selected files
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] border border-[color:var(--accent-ring)]">
                  {files.length}
                </span>
              </h3>
              {!isUploading && (
                <button
                  onClick={() => {
                    setFiles([]);
                    setFileBanks({});
                    setFilePasswords({});
                  }}
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <ul className="divide-y divide-[var(--border-color)]">
              {files.map((file, index) => {
                const bank = bankBySlug(fileBanks[file.name]);
                return (
                  <motion.li
                    key={`${file.name}-${index}`}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 md:px-6 py-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center shrink-0">
                        <File size={18} className="text-[color:var(--accent)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={fileBanks[file.name] || ""}
                        onChange={(e) =>
                          setFileBanks({
                            ...fileBanks,
                            [file.name]: e.target.value,
                          })
                        }
                        disabled={isUploading}
                        className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                      >
                        <option value="">Select bank</option>
                        {banks.map((b) => (
                          <option key={b.id} value={b.slug}>
                            {b.name}
                          </option>
                        ))}
                      </select>

                      {bank?.requiresPassword && (
                        <div className="relative w-full sm:w-56">
                          <input
                            type={showPassword[file.name] ? "text" : "password"}
                            placeholder="Statement password"
                            value={filePasswords[file.name] || ""}
                            onChange={(e) =>
                              setFilePasswords({
                                ...filePasswords,
                                [file.name]: e.target.value,
                              })
                            }
                            disabled={isUploading}
                            className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 pr-10 text-sm focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                [file.name]: !showPassword[file.name],
                              })
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
                          >
                            {showPassword[file.name] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                      )}

                      {!isUploading && (
                        <button
                          onClick={() => removeFile(index)}
                          aria-label="Remove file"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {/* Progress / actions */}
            <div className="px-5 md:px-6 py-5 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/40">
              {isUploading ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-primary)] inline-flex items-center gap-2">
                      <Loader size={16} className="animate-spin text-[color:var(--accent)]" />
                      Processing files…
                    </span>
                    <span className="text-sm font-medium text-[color:var(--accent)]">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--accent), var(--accent-hover))",
                      }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <AnimatedButton
                    size="md"
                    className="flex-1"
                    onClick={handleUpload}
                    trailingIcon={<CheckCircle size={16} />}
                  >
                    Upload & process
                  </AnimatedButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

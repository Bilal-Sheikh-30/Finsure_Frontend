import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Lock,
  CheckCircle,
  Sparkles,
  KeyRound,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "../utils/toast";

export const Security: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const handleEnable2FA = () => setShowSetup(true);

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === "123456") {
      setTwoFactorEnabled(true);
      setShowSetup(false);
      setVerificationCode("");
      toast.success("Two-factor authentication enabled successfully!");
    } else {
      toast.error("Invalid verification code");
    }
  };

  const handleDisable2FA = () => {
    if (confirm("Are you sure you want to disable two-factor authentication?")) {
      setTwoFactorEnabled(false);
      toast.success("Two-factor authentication disabled");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--accent-ring)] bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-medium"
        >
          <Sparkles size={12} />
          Account protection
        </motion.div>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Security
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          Manage how you sign in and which devices can access your account.
        </p>
      </div>

      {/* 2FA card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 65%)",
          }}
        />
        <div className="relative flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent-glow)]"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            <Shield size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Two-factor authentication
            </h2>
            <p className="mt-1 text-[var(--text-secondary)] leading-relaxed">
              Add a second step to every sign-in. We'll ask for a 6-digit code
              from your authenticator app on top of your password.
            </p>
            <div className="mt-4">
              {twoFactorEnabled ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-medium">
                    <CheckCircle size={16} />
                    Enabled
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDisable2FA}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 text-sm font-medium transition-colors"
                  >
                    Disable
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnable2FA}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <KeyRound size={16} />
                  Enable 2FA
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Setup flow */}
      <AnimatePresence initial={false}>
        {showSetup && !twoFactorEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <QrCode className="text-[color:var(--accent)]" size={18} />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Set up two-factor authentication
                </h2>
              </div>

              <ol className="space-y-6">
                {/* Step 1 */}
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[color:var(--accent)] font-bold text-sm">
                      1
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--text-primary)] font-semibold mb-1">
                      Download an authenticator app
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Install Google Authenticator, Authy, or 1Password on your
                      phone.
                    </p>
                  </div>
                </li>

                {/* Step 2 */}
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[color:var(--accent)] font-bold text-sm">
                      2
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--text-primary)] font-semibold mb-2">
                      Scan the QR code
                    </h3>
                    <div className="inline-block p-3 rounded-2xl bg-white border border-[var(--border-color)] shadow-[0_10px_30px_-20px_var(--accent-glow)]">
                      <div className="w-44 h-44 rounded-lg bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0] flex items-center justify-center">
                        <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                          QR placeholder
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-3">
                      Or enter this code manually:{" "}
                      <code className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-2 py-1 rounded text-xs">
                        ABCD-EFGH-IJKL
                      </code>
                    </p>
                  </div>
                </li>

                {/* Step 3 */}
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[color:var(--accent)] font-bold text-sm">
                      3
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--text-primary)] font-semibold mb-2">
                      Enter the 6-digit code
                    </h3>
                    <form onSubmit={handleVerify2FA} className="space-y-3">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        inputMode="numeric"
                        className="w-full sm:w-64 bg-[var(--bg-primary)] text-[var(--text-primary)] tracking-[0.4em] text-center font-semibold text-lg border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                      />
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                          }}
                        >
                          <CheckCircle size={16} />
                          Verify & enable
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => setShowSetup(false)}
                          className="px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 font-medium text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Demo code: <span className="font-mono">123456</span>
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active sessions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center flex-shrink-0">
            <Lock className="text-[color:var(--accent)]" size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Active sessions
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Devices currently signed in to your account.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-ring)] flex items-center justify-center">
                    <Smartphone className="text-[color:var(--accent)]" size={18} />
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium text-sm">
                      Current session
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Chrome on Windows · Active now
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

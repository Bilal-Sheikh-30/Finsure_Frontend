import React, { useEffect, useState } from "react";
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
import { twoFactorApi } from "../services/apiClient";

export const Security: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [setupData, setSetupData] = useState<
    | {
        otpauth_uri: string;
        qr_code_data_url: string;
        manual_entry_key: string;
      }
    | null
  >(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableBackupCode, setDisableBackupCode] = useState("");
  const [disableUseBackupCode, setDisableUseBackupCode] = useState(false);
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [regenPassword, setRegenPassword] = useState("");
  const [regenCode, setRegenCode] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      try {
        const res = await twoFactorApi.getStatus();
        if (!isMounted) return;
        setTwoFactorEnabled(!!res.enabled);
        setBackupCodesRemaining(res.backup_codes_remaining ?? 0);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Failed to load 2FA status");
      } finally {
        if (isMounted) setIsStatusLoading(false);
      }
    };

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnable2FA = async () => {
    setIsWorking(true);
    try {
      const res = await twoFactorApi.startSetup();
      setSetupData(res);
      setShowSetup(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to start 2FA setup");
    } finally {
      setIsWorking(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorking(true);
    try {
      const res = await twoFactorApi.verifySetup({ code: verificationCode });
      setTwoFactorEnabled(true);
      setBackupCodes(res.backup_codes || []);
      setBackupCodesRemaining((res.backup_codes || []).length);
      setShowSetup(false);
      setVerificationCode("");
      toast.success("Two-factor authentication enabled successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Invalid verification code");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorking(true);
    try {
      await twoFactorApi.disable({
        password: disablePassword,
        code: disableUseBackupCode ? undefined : disableCode,
        backup_code: disableUseBackupCode ? disableBackupCode : undefined,
      });
      setTwoFactorEnabled(false);
      setBackupCodes([]);
      setBackupCodesRemaining(0);
      setShowDisableForm(false);
      setDisablePassword("");
      setDisableCode("");
      setDisableBackupCode("");
      toast.success("Two-factor authentication disabled");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to disable 2FA");
    } finally {
      setIsWorking(false);
    }
  };

  const handleRegenerateBackupCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorking(true);
    try {
      const res = await twoFactorApi.regenerateBackupCodes({
        password: regenPassword,
        code: regenCode,
      });
      setBackupCodes(res.backup_codes || []);
      setBackupCodesRemaining((res.backup_codes || []).length);
      setShowRegenerateForm(false);
      setRegenPassword("");
      setRegenCode("");
      toast.success("Backup codes regenerated");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to regenerate backup codes");
    } finally {
      setIsWorking(false);
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
                    onClick={() => setShowDisableForm((prev) => !prev)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 text-sm font-medium transition-colors"
                  >
                    {showDisableForm ? "Cancel" : "Disable"}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowRegenerateForm((prev) => !prev)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 text-sm font-medium transition-colors"
                  >
                    {showRegenerateForm ? "Hide backup codes" : "Regenerate backup codes"}
                  </motion.button>
                </div>
              ) : isStatusLoading ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm opacity-70 cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  <KeyRound size={16} />
                  Checking status...
                </button>
              ) : (
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnable2FA}
                  disabled={isWorking || isStatusLoading}
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
              {twoFactorEnabled && (
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  Backup codes remaining: {backupCodesRemaining}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {backupCodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Backup codes
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Save these codes in a safe place. Each code can be used once.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {backupCodes.map((code) => (
              <div
                key={code}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm font-mono tracking-widest text-[var(--text-primary)]"
              >
                {code}
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
                      {setupData?.qr_code_data_url ? (
                        <img
                          src={setupData.qr_code_data_url}
                          alt="2FA QR code"
                          className="w-44 h-44 rounded-lg"
                        />
                      ) : (
                        <div className="w-44 h-44 rounded-lg bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0] flex items-center justify-center">
                          <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                            Loading QR
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-3">
                      Or enter this code manually:{" "}
                      <code className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] px-2 py-1 rounded text-xs">
                        {setupData?.manual_entry_key || "-"}
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
                        disabled={isWorking}
                        className="w-full sm:w-64 bg-[var(--bg-primary)] text-[var(--text-primary)] tracking-[0.4em] text-center font-semibold text-lg border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                      />
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isWorking}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                          }}
                        >
                          <CheckCircle size={16} />
                          {isWorking ? "Enabling..." : "Verify & enable"}
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
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {twoFactorEnabled && showDisableForm && (
          <motion.div
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Disable two-factor authentication
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Confirm your password and a 2FA method to continue.
              </p>
              <form onSubmit={handleDisable2FA} className="mt-4 space-y-3">
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                  required
                />
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDisableUseBackupCode(false)}
                    className={`px-3 py-1 rounded-full border ${
                      !disableUseBackupCode
                        ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                        : "border-[var(--border-color)] text-[var(--text-secondary)]"
                    }`}
                  >
                    Authenticator code
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisableUseBackupCode(true)}
                    className={`px-3 py-1 rounded-full border ${
                      disableUseBackupCode
                        ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                        : "border-[var(--border-color)] text-[var(--text-secondary)]"
                    }`}
                  >
                    Backup code
                  </button>
                </div>
                {disableUseBackupCode ? (
                  <input
                    type="text"
                    value={disableBackupCode}
                    onChange={(e) => setDisableBackupCode(e.target.value)}
                    placeholder="ABCD-EFGH"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] tracking-[0.3em] text-center font-semibold text-lg border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                    required
                  />
                )}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isWorking}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    }}
                  >
                    {isWorking ? "Disabling..." : "Disable 2FA"}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowDisableForm(false)}
                    disabled={isWorking}
                    className="px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {twoFactorEnabled && showRegenerateForm && (
          <motion.div
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Regenerate backup codes
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                This replaces any unused codes with a new set.
              </p>
              <form onSubmit={handleRegenerateBackupCodes} className="mt-4 space-y-3">
                <input
                  type="password"
                  value={regenPassword}
                  onChange={(e) => setRegenPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                  required
                />
                <input
                  type="text"
                  value={regenCode}
                  onChange={(e) => setRegenCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] tracking-[0.3em] text-center font-semibold text-lg border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
                  required
                />
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isWorking}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-[0_10px_30px_-10px_var(--accent-glow)]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    }}
                  >
                    {isWorking ? "Regenerating..." : "Regenerate codes"}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowRegenerateForm(false)}
                    disabled={isWorking}
                    className="px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[color:var(--accent)]/60 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader, Eye, EyeOff, ArrowRight } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "../utils/toast";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthField } from "../components/auth/AuthField";
import { AnimatedButton } from "../components/ui/AnimatedButton";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your FINSURE dashboard."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] font-medium transition-colors"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail size={18} />}
          placeholder="you@company.com"
          autoComplete="email"
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          placeholder="••••••••"
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-[color:var(--accent)]"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] transition-colors"
            onClick={() =>
              toast.info("Password reset coming soon — email support@finsure.app")
            }
          >
            Forgot password?
          </button>
        </div>

        <AnimatedButton
          type="submit"
          size="md"
          className="w-full"
          disabled={isLoading}
          trailingIcon={
            isLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <ArrowRight size={16} />
            )
          }
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </AnimatedButton>
      </form>
    </AuthShell>
  );
};

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Loader,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../utils/toast";
import { AuthShell } from "../components/auth/AuthShell";
import { AuthField } from "../components/auth/AuthField";
import { AnimatedButton } from "../components/ui/AnimatedButton";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!userType) {
      toast.error("Please select a user type");
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name, userType);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free — no credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] font-medium transition-colors"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          icon={<User size={18} />}
          placeholder="Jane Doe"
          autoComplete="name"
        />

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

        {/* User-type select — reuses the global themed <select> styling */}
        <div>
          <label
            htmlFor="auth-user-type"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5"
          >
            I am a…
          </label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[color:var(--accent)] transition-colors">
              <Briefcase size={18} />
            </span>
            <select
              id="auth-user-type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pl-11 py-3 rounded-xl border border-[var(--border-color)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-ring)] focus:outline-none transition-all"
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="businessman">Business owner</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
        </div>

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          placeholder="At least 6 characters"
          autoComplete="new-password"
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

        <AuthField
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          placeholder="Repeat password"
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

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
          {isLoading ? "Creating account…" : "Create account"}
        </AnimatedButton>

        <p className="text-xs text-center text-[var(--text-secondary)]">
          By signing up you agree to our{" "}
          <Link
            to="/"
            className="text-[color:var(--accent)] hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/"
            className="text-[color:var(--accent)] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
};

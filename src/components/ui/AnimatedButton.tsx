import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  // Narrow away Framer's MotionValue children union so downstream <span>
  // accepts it as a plain ReactNode.
  children?: React.ReactNode;
}

/**
 * Reusable pill button with spring-based hover + press micro-interactions.
 *
 * Three variants cover ~95% of marketing-page CTA needs:
 *   primary   — cyan gradient, high-prominence (main action)
 *   secondary — outlined, low-prominence (secondary action)
 *   ghost     — text-only with subtle hover wash (tertiary / nav)
 *
 * Tailwind classes are kept here (not split per-variant) so a reader can see
 * the whole button definition at a glance. Color tokens are hard-coded to
 * the FINSURE brand palette intentionally — these CTAs are the brand.
 */
export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const sizeClasses =
      size === "sm"
        ? "px-4 py-2 text-sm"
        : size === "lg"
          ? "px-8 py-4 text-lg"
          : "px-6 py-3 text-base";

    // Primary still uses the brand gradient — the cyan-on-navy text combo
    // reads clean on both themes because the button pill itself is the
    // bright cyan and the label is the deep navy.
    //
    // Secondary + ghost reference --accent so they shift between the bright
    // dark-mode cyan and the deeper light-mode cyan automatically.
    const variantClasses =
      variant === "primary"
        ? "bg-gradient-to-r from-[#0ab6ff] to-[#14e7ff] text-[#0c111a] font-semibold shadow-accent hover:shadow-[0_16px_44px_-10px_var(--accent-glow)]"
        : variant === "secondary"
          ? "bg-[var(--bg-secondary)]/60 backdrop-blur-md border border-[color:var(--accent)]/50 text-[color:var(--accent)] hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
          : "text-[var(--text-primary)] hover:text-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]";

    return (
      <motion.button
        ref={ref}
        // Spring hover lift + tactile press. whileTap fires even on touch.
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
        {...rest}
      >
        {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

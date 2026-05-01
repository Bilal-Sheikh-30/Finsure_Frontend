import React from "react";

/**
 * FINSURE brand mark + wordmark.
 *
 * Design: a rounded square with a stylized "F" whose crossbar rises like a
 * chart line, nodding to the product's financial-insights angle. Brand color
 * is #14e7ff on the app's dark #0c111a background (and inverts on the mark
 * itself so the F stays legible against the cyan fill).
 *
 *  - variant="full"   -> mark + FINSURE wordmark (sidebar expanded, auth pages)
 *  - variant="mark"   -> mark only (sidebar collapsed, favicons, tight spots)
 *  - variant="inline" -> small mark + wordmark sized for inline headers
 */
export interface LogoProps {
  variant?: "full" | "mark" | "inline";
  size?: number;          // pixel height of the mark
  className?: string;
  wordmarkClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  size = 36,
  className = "",
  wordmarkClassName = "",
}) => {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="finsure-logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14e7ff" />
          <stop offset="100%" stopColor="#0ab6ff" />
        </linearGradient>
        <linearGradient id="finsure-logo-spark" x1="10" y1="34" x2="40" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0c111a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0c111a" />
        </linearGradient>
      </defs>

      {/* Rounded tile */}
      <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#finsure-logo-bg)" />

      {/* Stylized "F" - vertical stem + two horizontal bars */}
      <rect x="14" y="12" width="5" height="24" rx="1.5" fill="#0c111a" />
      <rect x="14" y="12" width="20" height="5" rx="1.5" fill="#0c111a" />
      <rect x="14" y="22" width="14" height="4.5" rx="1.5" fill="#0c111a" />

      {/* Upward chart spark rising out of the F, suggests "growth / insight" */}
      <path
        d="M14 34 L22 28 L28 31 L36 20"
        stroke="url(#finsure-logo-spark)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="36" cy="20" r="2" fill="#0c111a" />
    </svg>
  );

  if (variant === "mark") {
    return <span className={className}>{mark}</span>;
  }

  const wordmarkSize = variant === "inline" ? "text-lg" : "text-2xl";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span
        className={`font-bold tracking-tight text-[var(--text-primary)] ${wordmarkSize} ${wordmarkClassName}`}
      >
        FIN<span className="text-[#14e7ff]">SURE</span>
      </span>
    </span>
  );
};

export default Logo;

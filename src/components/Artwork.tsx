// Generative brand artwork used where real photography will later go.
// Each variant echoes the Build / Execute / Grow language of the site.

export type ArtVariant = "rings" | "glow" | "stack" | "bars" | "waves" | "split";

const INK = "#181822";
const PAPER = "#f8f8f8";
const BRAND = "#007ffd";

export default function Artwork({
  variant,
  dark = true,
  label,
  className = "",
}: {
  variant: ArtVariant;
  dark?: boolean;
  label?: string;
  className?: string;
}) {
  const bg = dark ? INK : "#ececea";
  const fg = dark ? PAPER : INK;
  const id = `${variant}-${dark ? "d" : "l"}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label={label ?? "Abstract OP DEV artwork"}
    >
      <defs>
        <radialGradient id={`g-${id}`} cx="70%" cy="40%" r="65%">
          <stop offset="0%" stopColor={BRAND} stopOpacity={dark ? 0.85 : 0.6} />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </radialGradient>
        <pattern id={`p-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={fg} strokeOpacity="0.08" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={bg} />
      <rect width="400" height="300" fill={`url(#p-${id})`} />

      {variant === "rings" && (
        <g fill="none" stroke={fg}>
          {[30, 55, 80, 105, 130].map((r, i) => (
            <circle key={r} cx="250" cy="150" r={r} strokeOpacity={0.12 + i * 0.12} strokeWidth="1" />
          ))}
          <circle cx="250" cy="150" r="56" fill={`url(#g-${id})`} stroke="none" />
          <circle cx="355" cy="62" r="7" fill={BRAND} stroke="none" />
        </g>
      )}

      {variant === "glow" && (
        <g>
          <rect width="400" height="300" fill={`url(#g-${id})`} />
          <circle cx="270" cy="130" r="70" fill="none" stroke={fg} strokeOpacity="0.5" />
          <line x1="0" y1="230" x2="400" y2="60" stroke={fg} strokeOpacity="0.35" />
          <line x1="0" y1="260" x2="400" y2="110" stroke={BRAND} strokeOpacity="0.8" />
        </g>
      )}

      {variant === "stack" && (
        <g>
          <rect width="400" height="300" fill={`url(#g-${id})`} opacity="0.6" />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={130 + k * 22}
              y={190 - k * 52}
              width={170 - k * 44}
              height="40"
              rx="12"
              fill={k === 2 ? BRAND : "none"}
              stroke={fg}
              strokeOpacity={k === 2 ? 0 : 0.6}
            />
          ))}
        </g>
      )}

      {variant === "bars" && (
        <g>
          {[40, 70, 95, 130, 160, 205].map((h, i) => (
            <rect
              key={i}
              x={70 + i * 46}
              y={250 - h}
              width="26"
              height={h}
              rx="4"
              fill={i === 5 ? BRAND : fg}
              fillOpacity={i === 5 ? 1 : 0.12 + i * 0.1}
            />
          ))}
          <path d="M60 230 C 160 210, 220 150, 340 50" fill="none" stroke={fg} strokeOpacity="0.6" strokeDasharray="4 6" />
        </g>
      )}

      {variant === "waves" && (
        <g fill="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${120 + i * 14} C 100 ${60 + i * 18}, 220 ${200 - i * 6}, 400 ${110 + i * 12}`}
              stroke={i === 4 ? BRAND : fg}
              strokeOpacity={i === 4 ? 1 : 0.18 + i * 0.04}
              strokeWidth={i === 4 ? 2 : 1}
            />
          ))}
        </g>
      )}

      {variant === "split" && (
        <g>
          <rect x="200" width="200" height="300" fill={BRAND} />
          <circle cx="200" cy="150" r="80" fill="none" stroke={fg} strokeOpacity="0.7" />
          <text
            x="200"
            y="178"
            textAnchor="middle"
            fontFamily="var(--font-accent), sans-serif"
            
            fontSize="92" fontWeight="700"
            fill={fg}
          >
            op
          </text>
        </g>
      )}
    </svg>
  );
}

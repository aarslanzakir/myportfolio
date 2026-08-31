/**
 * Generated cover art for a project card.
 *
 * Deliberately abstract: it is derived from the project id, not from the
 * real site, so it can never be mistaken for a screenshot of work that
 * doesn't look like that. Same id always yields the same artwork, so
 * covers stay stable across deploys.
 *
 * Pure SVG, rendered on the server. No image request, no client JS.
 */

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Warm band only, so every cover stays inside the gold theme. */
const PALETTES = [
  ["#f7d07a", "#e8814a"],
  ["#f0b429", "#d1961d"],
  ["#e8814a", "#f0b429"],
  ["#d1961d", "#f7d07a"],
];

export default function ProjectCover({
  id,
  title,
  className = "",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const h = hash(id);
  const [from, to] = PALETTES[h % PALETTES.length];
  const variant = Math.floor(h / 7) % 4;
  const rotate = (h % 40) - 20;
  const gid = `cov-${id.replace(/[^a-z0-9]/gi, "")}`;

  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <svg
      viewBox="0 0 400 160"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Abstract cover artwork for ${title}`}
      className={className}
    >
      <defs>
        <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0.85" />
          <stop offset="100%" stopColor={to} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${gid}-r`} cx="78%" cy="18%" r="72%">
          <stop offset="0%" stopColor={from} stopOpacity="0.5" />
          <stop offset="100%" stopColor={from} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${gid}-c`}>
          <rect width="400" height="160" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${gid}-c)`}>
        <rect width="400" height="160" fill="#0d0f14" />
        <rect width="400" height="160" fill={`url(#${gid}-r)`} />

        <g
          transform={`rotate(${rotate} 200 80)`}
          stroke={`url(#${gid}-g)`}
          fill="none"
          strokeWidth="1.5"
        >
          {variant === 0 &&
            Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx="300" cy="40" r={22 + i * 26} opacity={0.55 - i * 0.05} />
            ))}

          {variant === 1 &&
            Array.from({ length: 14 }, (_, i) => (
              <line
                key={i}
                x1={-40 + i * 36}
                y1="-40"
                x2={40 + i * 36}
                y2="200"
                opacity={0.5 - i * 0.025}
              />
            ))}

          {variant === 2 &&
            Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x={40 + i * 46}
                y={20 + (i % 3) * 22}
                width="34"
                height={100 - (i % 3) * 24}
                rx="6"
                opacity={0.5 - i * 0.05}
              />
            ))}

          {variant === 3 &&
            Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M -20 ${140 - i * 20} Q 120 ${60 - i * 18} 200 ${90 - i * 16} T 420 ${40 - i * 14}`}
                opacity={0.55 - i * 0.07}
              />
            ))}
        </g>

        {/* monogram, kept low-contrast so it reads as texture not a logo */}
        <text
          x="28"
          y="132"
          fontSize="64"
          fontWeight="700"
          fill={from}
          fillOpacity="0.14"
          fontFamily="var(--font-display), sans-serif"
        >
          {initials}
        </text>
      </g>
    </svg>
  );
}

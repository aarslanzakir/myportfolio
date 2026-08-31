/**
 * Generated cover art for a project card.
 *
 * Deliberately abstract: it is derived from the project id, not from the
 * real site, so it can never be mistaken for a screenshot of work that
 * doesn't look like that. Same id always yields the same artwork, so
 * covers stay stable across deploys.
 *
 * Used as a full-card background texture, so it is decorative and hidden
 * from assistive tech. Pure SVG rendered on the server: no image request,
 * no client JS.
 *
 * The 4:3 viewBox is close to the card's own aspect ratio, so `slice`
 * crops very little at either end of the responsive range.
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
  const rotate = (h % 30) - 15;
  const gid = `cov-${id.replace(/[^a-z0-9]/gi, "")}`;

  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0.9" />
          <stop offset="100%" stopColor={to} stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${gid}-r`} cx="80%" cy="12%" r="85%">
          <stop offset="0%" stopColor={from} stopOpacity="0.42" />
          <stop offset="100%" stopColor={from} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill="#0d0f14" />
      <rect width="400" height="300" fill={`url(#${gid}-r)`} />

      {/* monogram sits behind the pattern, low contrast so it reads as
          texture rather than as a logo the client didn't approve */}
      <text
        x="196"
        y="250"
        textAnchor="middle"
        fontSize="210"
        fontWeight="800"
        fill={from}
        fillOpacity="0.07"
        fontFamily="var(--font-display), sans-serif"
      >
        {initials}
      </text>

      <g
        transform={`rotate(${rotate} 200 150)`}
        stroke={`url(#${gid}-g)`}
        fill="none"
        strokeWidth="1.5"
      >
        {variant === 0 &&
          Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx="330" cy="40" r={30 + i * 42} opacity={0.6 - i * 0.045} />
          ))}

        {variant === 1 &&
          Array.from({ length: 18 }, (_, i) => (
            <line
              key={i}
              x1={-120 + i * 40}
              y1="-40"
              x2={120 + i * 40}
              y2="340"
              opacity={0.55 - i * 0.026}
            />
          ))}

        {variant === 2 &&
          Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={-10 + i * 50}
              y={30 + (i % 3) * 40}
              width="38"
              height={230 - (i % 3) * 50}
              rx="8"
              opacity={0.5 - i * 0.04}
            />
          ))}

        {variant === 3 &&
          Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M -30 ${290 - i * 34} Q 120 ${170 - i * 30} 200 ${210 - i * 28} T 430 ${120 - i * 24}`}
              opacity={0.6 - i * 0.055}
            />
          ))}
      </g>
    </svg>
  );
}

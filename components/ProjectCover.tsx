/**
 * Generated cover art for a project card.
 *
 * Original artwork, drawn from a hash of the project id. Deliberately
 * abstract: it is not derived from the real site, so it can never be
 * mistaken for a screenshot of work that doesn't look like that. The
 * same id always yields the same art, so covers stay stable across
 * deploys.
 *
 * Vector, so it is pin-sharp at any density: a 4K monitor gets the same
 * ~2KB of markup as a phone. Rendered on the server, no image request,
 * no client JS.
 */

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic pseudo-random stream seeded off the id. */
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Warm band only, so every cover stays inside the gold theme. */
const PALETTES = [
  ["#f7d07a", "#e8814a", "#d1961d"],
  ["#f0b429", "#d1961d", "#f7d07a"],
  ["#e8814a", "#f0b429", "#f7d07a"],
  ["#d1961d", "#f7d07a", "#e8814a"],
];

export default function ProjectCover({
  id,
  title,
  className = "",
  /** `wide` for the large spotlight cards, `compact` for gallery tiles */
  variant = "wide",
}: {
  id: string;
  title: string;
  className?: string;
  variant?: "wide" | "compact";
}) {
  const h = hash(id);
  const rand = rng(h);
  // Separate hashes, or palette and shape correlate and neighbouring
  // cards end up looking like near-duplicates of each other.
  const [c1, c2, c3] = PALETTES[hash(id + "|palette") % PALETTES.length];
  const shape = hash(id + "|shape") % 6;
  const gid = `pc-${id.replace(/[^a-z0-9]/gi, "")}`;

  const W = 400;
  const H = variant === "compact" ? 200 : 300;

  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  // Three soft colour fields, placed by the seed. This is what gives each
  // cover its own light rather than a flat wash.
  const blobs = [
    { c: c1, x: 12 + rand() * 22, y: 8 + rand() * 22, r: 46 + rand() * 18, o: 0.2 },
    { c: c2, x: 64 + rand() * 26, y: 58 + rand() * 30, r: 40 + rand() * 16, o: 0.14 },
    { c: c3, x: 40 + rand() * 24, y: 30 + rand() * 24, r: 30 + rand() * 14, o: 0.07 },
  ];

  const stroke = `url(#${gid}-line)`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={`${gid}-line`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="1" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.45" />
        </linearGradient>

        {blobs.map((b, i) => (
          <radialGradient key={i} id={`${gid}-b${i}`}>
            <stop offset="0%" stopColor={b.c} stopOpacity={b.o} />
            <stop offset="100%" stopColor={b.c} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* Fine grid, the texture that reads as "engineered" */}
        <pattern id={`${gid}-grid`} width="22" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M22 0H0V22"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#07080b" />

      {/* colour fields */}
      {blobs.map((b, i) => (
        <ellipse
          key={i}
          cx={(b.x / 100) * W}
          cy={(b.y / 100) * H}
          rx={(b.r / 100) * W}
          ry={(b.r / 100) * H}
          fill={`url(#${gid}-b${i})`}
        />
      ))}

      <rect width={W} height={H} fill={`url(#${gid}-grid)`} />

      {/* monogram, low contrast so it reads as texture not a logo */}
      <text
        x={W / 2}
        y={H * 0.82}
        textAnchor="middle"
        fontSize={H * 0.7}
        fontWeight="800"
        fill={c1}
        fillOpacity="0.045"
        fontFamily="var(--font-display), sans-serif"
      >
        {initials}
      </text>

      <g fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
        {/* concentric rings */}
        {shape === 0 &&
          Array.from({ length: 11 }, (_, i) => (
            <circle
              key={i}
              cx={W * 0.82}
              cy={H * 0.14}
              r={26 + i * 34}
              opacity={0.7 - i * 0.055}
            />
          ))}

        {/* diagonal rule field */}
        {shape === 1 &&
          Array.from({ length: 16 }, (_, i) => (
            <line
              key={i}
              x1={-100 + i * 42}
              y1={-20}
              x2={60 + i * 42}
              y2={H + 20}
              opacity={0.62 - i * 0.032}
            />
          ))}

        {/* stepped bars */}
        {shape === 2 &&
          Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={-6 + i * 48}
              y={H * 0.12 + (i % 3) * (H * 0.13)}
              width="34"
              height={H * 0.76 - (i % 3) * (H * 0.16)}
              rx="7"
              opacity={0.6 - i * 0.05}
            />
          ))}

        {/* flowing contours */}
        {shape === 3 &&
          Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M -30 ${H * 0.95 - i * (H * 0.11)} Q ${W * 0.3} ${H * 0.55 - i * (H * 0.1)} ${W * 0.5} ${H * 0.7 - i * (H * 0.095)} T ${W + 30} ${H * 0.4 - i * (H * 0.08)}`}
              opacity={0.72 - i * 0.065}
            />
          ))}

        {/* constellation */}
        {shape === 4 &&
          (() => {
            const pts = Array.from({ length: 14 }, () => ({
              x: rand() * W,
              y: rand() * H,
            }));
            return (
              <>
                {pts.slice(0, 13).map((p, i) => (
                  <line
                    key={`l${i}`}
                    x1={p.x}
                    y1={p.y}
                    x2={pts[i + 1].x}
                    y2={pts[i + 1].y}
                    opacity="0.45"
                  />
                ))}
                {pts.map((p, i) => (
                  <circle key={`c${i}`} cx={p.x} cy={p.y} r="3" opacity="0.8" />
                ))}
              </>
            );
          })()}

        {/* circuit traces */}
        {shape === 5 &&
          Array.from({ length: 7 }, (_, i) => {
            const y = H * 0.12 + i * (H * 0.13);
            const bend = W * (0.25 + rand() * 0.45);
            return (
              <path
                key={i}
                d={`M -10 ${y} H ${bend} L ${bend + 26} ${y + 26} H ${W + 10}`}
                opacity={0.66 - i * 0.07}
              />
            );
          })}
      </g>
    </svg>
  );
}

/**
 * Inline stroke icons: no icon library, no extra network request.
 * Add new keys here and reference them by name from lib/content.ts.
 */

type IconProps = {
  name: string;
  className?: string;
};

const PATHS: Record<string, React.ReactNode> = {
  code: (
    <>
      <path d="m9 17-5-5 5-5" />
      <path d="m15 7 5 5-5 5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.9 4.9L19 9.8l-4.1 2.1L12 17l-2.9-5.1L5 9.8l5.1-1.9L12 3Z" />
      <path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.6" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v6" />
      <path d="M15 3v6" />
      <path d="M6 9h12v3a6 6 0 0 1-12 0V9Z" />
      <path d="M12 18v3" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 11.2A3.9 3.9 0 0 0 7 19h10.5Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v6c0 4.2-3 7.8-7.5 9-4.5-1.2-7.5-4.8-7.5-9V6L12 3Z" />
      <path d="m9.2 11.8 2 2 3.6-3.6" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12.5c0 3.9-3.6 7-8 7a9 9 0 0 1-2.4-.32L5 21l1.2-3.5A6.6 6.6 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.2 12a8.2 8.2 0 0 1-12.3 7.1L4 20.2l1.2-3.8A8.2 8.2 0 1 1 20.2 12Z" />
      <path d="M9.4 9.2c-.3.7-.1 1.7.7 2.7.9 1.1 1.9 1.7 2.7 1.9.6.1 1.3-.5 1.5-1l-1.5-.8-.7.6c-.6-.3-1.2-.9-1.5-1.6l.6-.6-.8-1.5c-.4.1-.8.2-1 .3Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.4 6.5-10a6.5 6.5 0 0 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8V12l3 1.8" />
    </>
  ),
};

export default function Icon({ name, className = "size-5" }: IconProps) {
  const path = PATHS[name] ?? PATHS.check;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {path}
    </svg>
  );
}

import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";

/* ------------------------------------------------------------------
   Buttons
   ------------------------------------------------------------------ */

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  /** Adds target=_blank + rel for outbound links */
  external?: boolean;
  icon?: string;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium " +
  "px-6 py-3.5 transition-all duration-300 active:scale-[0.98] whitespace-nowrap";

export function PrimaryButton({
  href,
  children,
  external,
  icon = "arrow",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 text-ink-950
        shadow-[0_10px_36px_-10px_rgba(240,180,41,0.45)]
        hover:shadow-[0_14px_44px_-8px_rgba(232,129,74,0.55)] hover:brightness-110 ${className}`}
    >
      {children}
      <Icon
        name={icon}
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  external,
  icon,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} glass text-mist-200 hover:border-white/20 hover:bg-white/[0.07]
        hover:text-white ${className}`}
    >
      {icon && <Icon name={icon} className="size-4" />}
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------
   Section scaffolding
   ------------------------------------------------------------------ */

export function SectionHeading({
  sectionId,
  eyebrow,
  title,
  highlight,
  blurb,
  align = "center",
}: {
  /** Id of the wrapping <Section>. Wires up its aria-labelledby, so the
      heading actually names the landmark instead of leaving it anonymous. */
  sectionId?: string;
  eyebrow: string;
  title: string;
  /** Rendered in gradient right after `title` */
  highlight?: string;
  blurb?: string;
  align?: "center" | "left";
}) {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
        <span className="size-1.5 rounded-full bg-accent-300" />
        {eyebrow}
      </span>

      <h2
        id={sectionId ? `${sectionId}-heading` : undefined}
        className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl md:text-[2.75rem]"
      >
        {title}
        {highlight && <> <span className="text-gradient">{highlight}</span></>}
      </h2>

      {blurb && (
        <p className="text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
          {blurb}
        </p>
      )}
    </Reveal>
  );
}

/** Consistent vertical rhythm + max width for every section on the page */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={`relative px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20 xl:px-16 ${className}`}
    >
      <div className="mx-auto w-full max-w-shell">{children}</div>
    </section>
  );
}

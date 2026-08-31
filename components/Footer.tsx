import Link from "next/link";
import Icon from "./Icon";
import { navLinks, profile, whatsappUrl } from "@/lib/content";

/** Keys of profile.socials -> the label read out to screen readers. */
const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  upwork: "Upwork",
};

export default function Footer() {
  const socials = Object.entries(profile.socials).filter(([, url]) => url);

  return (
    <footer className="mt-auto border-t border-white/[0.07] px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-shell">
        {/* CTA band */}
        <div className="ring-gradient relative overflow-hidden rounded-3xl">
          <span className="ring-gradient-inner" />
          <div className="relative flex flex-col items-center gap-6 bg-gradient-to-br from-white/[0.07] to-white/[0.015] px-6 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl">
              Got a project in mind?{" "}
              <span className="text-gradient">Let&apos;s scope it this week.</span>
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-mist-400">
              Free 30-minute call, no obligation. Bring a rough idea or a full
              spec, either works.
            </p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-7 py-3.5 text-sm font-medium text-ink-950 shadow-[0_10px_36px_-10px_rgba(240,180,41,0.45)] transition-all duration-300 hover:brightness-110"
            >
              <Icon name="whatsapp" className="size-4" />
              Message me on WhatsApp
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* meta row */}
        <div className="mt-10 flex flex-col items-center gap-6 border-t border-white/[0.07] pt-8 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-mist-50">{profile.name}</p>
            <p className="mt-1 text-xs text-mist-500">{profile.role}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist-400 transition-colors hover:text-mist-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-mist-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>

          {socials.length > 0 && (
            <ul className="flex gap-2">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    /* me: tells crawlers this profile is the same person
                       as the site owner, matching the sameAs in JSON-LD. */
                    rel="me noopener noreferrer"
                    className="grid size-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-mist-400 transition-colors hover:border-white/20 hover:text-white"
                    aria-label={SOCIAL_LABELS[name] ?? name}
                  >
                    <Icon name={name} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

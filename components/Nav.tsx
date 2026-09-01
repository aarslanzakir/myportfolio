"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ScrollProgress from "./ScrollProgress";
import { navLinks, profile, whatsappUrl } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Frost the bar once the user leaves the hero */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section currently on screen */
  useEffect(() => {
    /* Match on the section id, not the href: hrefs are paths like
       "/#work", which are not valid CSS selectors. */
    const sections = navLinks
      .map((l) => document.getElementById(l.section))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Sheet behaviour: lock the page behind it, close on Escape, and close
     if the viewport grows past the breakpoint where the sheet exists at
     all (otherwise it stays mounted and invisible, trapping scroll). */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);

    // Move focus into the sheet so the keyboard follows the eye.
    closeRef.current?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  /* Root-relative so the wordmark also works from /services/*, where a
     bare "#top" would just be a fragment of the wrong page. */
  const homeHref = "/#top";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        {/* Always mounted: it sits at zero width until you scroll, which
            is smoother than mounting it the moment you pass the threshold. */}
        <ScrollProgress />

        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-shell items-center justify-between gap-4 px-5 sm:h-18 sm:px-8 lg:px-12 xl:px-16"
        >
          <Link
            href={homeHref}
            className="flex items-center gap-2.5 text-sm font-semibold text-mist-50"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-[0.7rem] font-bold tracking-tight text-ink-950">
              {initials}
            </span>
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                    active === link.section
                      ? "text-mist-50"
                      : "text-mist-400 hover:text-mist-50"
                  }`}
                >
                  {active === link.section && (
                    <span className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]" />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_8px_28px_-10px_rgba(240,180,41,0.5)] transition-all duration-300 hover:brightness-110 sm:inline-flex"
            >
              <Icon name="whatsapp" className="size-4" />
              Let&apos;s talk
            </Link>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist-200 transition-colors hover:text-white md:hidden"
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ------------------------------------------------------------------
          Mobile sheet.

          Sits ABOVE the header (z-60) and carries its own top row, rather
          than sliding under a z-50 header that would clip the first links.
          The link list scrolls on its own, so a long menu on a short phone
          stays reachable instead of overflowing off both ends.
         ------------------------------------------------------------------ */}
      <div
        id="mobile-menu"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-60 md:hidden"
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={close}
          className="absolute inset-0 h-full w-full bg-ink-950/95 backdrop-blur-xl"
        />

        <div className="menu-panel relative flex h-dvh flex-col">
          {/* Top row mirrors the header's height so nothing appears to jump */}
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:h-18 sm:px-8">
            <Link
              href={homeHref}
              onClick={close}
              className="flex items-center gap-2.5 text-sm font-semibold text-mist-50"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-[0.7rem] font-bold tracking-tight text-ink-950">
                {initials}
              </span>
              {profile.name}
            </Link>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist-200 transition-colors hover:text-white"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>

          {/* Scrollable body: min-h-0 lets it shrink inside the flex column,
              overscroll-contain stops the page behind it from rubber-banding. */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <li key={link.href} style={{ animationDelay: `${60 + i * 45}ms` }} className="menu-item">
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`flex items-center justify-between border-b border-white/[0.07] py-4 text-2xl font-medium transition-colors ${
                      active === link.section
                        ? "text-accent-300"
                        : "text-mist-50 hover:text-accent-300"
                    }`}
                  >
                    {link.label}
                    <Icon name="arrow" className="size-5 text-mist-500" />
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className="menu-item mt-7 flex flex-col gap-3"
              style={{ animationDelay: `${60 + navLinks.length * 45}ms` }}
            >
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-4 font-medium text-ink-950"
              >
                <Icon name="whatsapp" className="size-5" />
                WhatsApp me
              </Link>
              <a
                href={`mailto:${profile.email}`}
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-mist-200"
              >
                <Icon name="mail" className="size-5" />
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

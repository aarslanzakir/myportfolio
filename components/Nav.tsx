"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { navLinks, profile, whatsappUrl } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  /* Shrink + frost the bar once the user leaves the hero */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section currently on screen */
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Lock body scroll behind the mobile sheet, and close it on Escape */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-shell items-center justify-between gap-4 px-5 sm:h-18 sm:px-8 lg:px-12 xl:px-16"
        >
          {/* Wordmark */}
          <Link
            href="#top"
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
                    active === link.href
                      ? "text-mist-50"
                      : "text-mist-400 hover:text-mist-50"
                  }`}
                >
                  {active === link.href && (
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

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist-200 transition-colors hover:text-white md:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 md:hidden"
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-xl" />

        <div className="relative flex h-full flex-col justify-center gap-2 px-7 pb-24">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 45}ms` }}
              className="border-b border-white/[0.07] py-4 text-2xl font-medium text-mist-50 transition-colors hover:text-accent-300"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-4 font-medium text-ink-950"
            >
              <Icon name="whatsapp" className="size-5" />
              WhatsApp me
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-mist-200"
            >
              <Icon name="mail" className="size-5" />
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

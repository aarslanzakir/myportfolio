"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in ms: handy when mapping over a list */
  delay?: number;
  /** Render as a different element than a div */
  as?: "div" | "section" | "li" | "article" | "header" | "p" | "span";
};

/**
 * Fades + lifts its children into view once, the first time they
 * intersect the viewport. Animation itself lives in globals.css so
 * `prefers-reduced-motion` can switch it off wholesale.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in view on first paint (or no observer support): just show it.
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-reveal", "shown");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error: one ref type across the union of allowed tags
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

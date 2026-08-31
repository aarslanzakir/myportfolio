"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up when it first scrolls into view.
 *
 * Takes the finished string ("78+", "<24h", "8+") and animates only the
 * digits inside it, so any prefix or suffix survives untouched and the
 * markup stays identical to the server-rendered output.
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/\d+/);

    // Nothing numeric, no observer, or reduced motion: leave it alone.
    if (
      !el ||
      !match ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const target = Number(match[0]);
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const prefix = value.slice(0, start);
    const suffix = value.slice(end);

    setDisplay(`${prefix}0${suffix}`);

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          // easeOutExpo: fast start, long settle
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

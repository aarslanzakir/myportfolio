"use client";

import { useCallback, useRef } from "react";

/**
 * Cursor-follow glow for a grid of cards.
 *
 * One mousemove listener lives on the container rather than on every
 * card, and it only writes two CSS custom properties, so the paint work
 * stays in the compositor. Cards opt in with `className="spotlight-target"`;
 * the gradient itself is defined in globals.css.
 */
export default function Spotlight({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const frame = useRef(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(
      ".spotlight-target",
    );
    if (!target) return;

    // Coalesce to one write per frame: mousemove fires far faster than paint.
    cancelAnimationFrame(frame.current);
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${clientX - rect.left}px`);
      target.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <Tag className={className} onMouseMove={onMove}>
      {children}
    </Tag>
  );
}

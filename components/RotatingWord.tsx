"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through `words` in place. Reserves the width of the longest
 * word with an invisible sizer so the headline never reflows mid-rotation.
 */
export default function RotatingWord({
  words,
  interval = 2600,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || words.length < 2) return;

    const cycle = setInterval(() => {
      setVisible(false);
      // swap the word while it's faded out
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 320);
    }, interval);

    return () => clearInterval(cycle);
  }, [words, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-grid align-bottom">
      {/* invisible sizer: keeps the layout stable */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {longest}
      </span>
      <span
        className={`text-gradient col-start-1 row-start-1 text-left transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100 blur-0" : "-translate-y-2 opacity-0 blur-sm"
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}

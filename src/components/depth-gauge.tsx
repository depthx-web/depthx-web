"use client";

import { useEffect, useRef, useState } from "react";

const TICKS = [
  "0m — CONCEPT",
  "240m — VALIDATION",
  "580m — IP FILED",
  "1200m — DEPLOYED",
] as const;

const TRACK_TOP = 96;
const TRACK_BOTTOM = 24;

/** Brand motif: a depth-scale readout on the right edge, its indicator tracks real scroll position. */
export function DepthGauge() {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const [indicatorTop, setIndicatorTop] = useState(TRACK_TOP);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function update() {
      const gauge = gaugeRef.current;
      if (!gauge) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const frac = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      const usable = Math.max(0, gauge.clientHeight - TRACK_TOP - TRACK_BOTTOM);
      setIndicatorTop(TRACK_TOP + usable * frac);
      setActiveIndex(Math.min(TICKS.length - 1, Math.floor(frac * TICKS.length)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={gaugeRef}
      aria-hidden="true"
      className="fixed top-0 right-0 bottom-0 z-[5] hidden w-11 flex-col justify-between border-r border-line py-6 pt-24 md:flex"
    >
      <div
        className="absolute left-0 h-0.5 w-full bg-green shadow-[0_0_8px_var(--color-green)] transition-[top] duration-150 ease-linear"
        style={{ top: indicatorTop }}
      />
      {TICKS.map((label, i) => (
        <div key={label} className="relative pl-2.5">
          <span
            className={`block w-2 border-t transition-colors duration-300 ${
              i === activeIndex ? "border-green" : "border-line"
            }`}
          />
          <span
            className={`font-mono text-[10px] tracking-wide transition-colors duration-300 [writing-mode:vertical-rl] ${
              i === activeIndex ? "text-green" : "text-muted"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

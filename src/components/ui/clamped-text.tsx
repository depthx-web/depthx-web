"use client";

import { useState } from "react";

// Tailwind's build-time class scanner needs literal class name strings —
// `line-clamp-${lines}` would silently never generate any CSS. This lookup
// keeps the strings literal while still letting callers pass a number.
const LINE_CLAMP_CLASS: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

/** Text clamped to a fixed number of lines with a "Show more"/"Show less"
 * toggle. Used inside cards that are themselves a whole-card <Link> — the
 * toggle is a <span role="button"> rather than a real <button> so it isn't
 * an interactive element nested inside another one, and its click handler
 * stops propagation so it doesn't also trigger the card's navigation. */
export function ClampedText({
  text,
  lines = 3,
  className = "",
}: {
  text: string;
  lines?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  function toggle(e: { preventDefault: () => void; stopPropagation: () => void }) {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((v) => !v);
  }

  return (
    <div>
      <p className={`${className} ${expanded ? "" : (LINE_CLAMP_CLASS[lines] ?? "line-clamp-3")}`}>
        {text}
      </p>
      <span
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle(e);
        }}
        className="mt-1.5 inline-block font-mono text-[11px] font-semibold text-blue hover:text-text"
      >
        {expanded ? "Show less" : "Show more"}
      </span>
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

// The blocking script in layout.tsx sets data-theme before paint, but the
// server obviously always renders the dark default — this is what
// useSyncExternalStore uses for the hydration render so it matches.
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage unavailable (private browsing, blocked storage) — theme
    // still applies for this page load, just doesn't persist.
  }
}

/** Sun/moon toggle. Reads the current theme via useSyncExternalStore (a
 * MutationObserver on <html data-theme>) rather than useState+useEffect, so
 * the DOM stays the single source of truth and there's no
 * setState-in-effect render cascade. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-all duration-200 hover:border-line-2 hover:text-text active:scale-90 ${className ?? ""}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 2.5v2.25M12 19.25v2.25M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.25M19.25 12h2.25M4.4 19.6l1.6-1.6M18 6l1.6-1.6"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M20.5 14.6A8.7 8.7 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z"
      />
    </svg>
  );
}

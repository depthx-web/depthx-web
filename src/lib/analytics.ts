declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

/**
 * Fires a Plausible custom event (spec §7: "role-selection tracking on the
 * Contact toggle"). No-ops until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set and the
 * script below has loaded — safe to call unconditionally from anywhere.
 */
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.plausible?.(name, props ? { props } : undefined);
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fires a fire-and-forget pageview beacon to /api/track on every navigation. */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't count admin activity as public site traffic.
    if (pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}

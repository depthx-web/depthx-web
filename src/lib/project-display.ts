import type { ProjectStatus } from "@/lib/types";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  granted: "Patent Granted",
  pending: "Patent Pending",
  licensing: "Available for Licensing",
};

// Tailwind can't resolve interpolated class names at build time, so each
// status gets its literal class strings written out rather than composed.
export const STATUS_CLASSES: Record<
  ProjectStatus,
  { top: string; badgeBg: string; badgeText: string; badgeBorder: string; dot: string }
> = {
  granted: {
    top: "bg-green",
    badgeBg: "bg-green/15",
    badgeText: "text-green",
    badgeBorder: "border-green/40",
    dot: "bg-green",
  },
  pending: {
    top: "bg-amber",
    badgeBg: "bg-amber/15",
    badgeText: "text-amber",
    badgeBorder: "border-amber/40",
    dot: "bg-amber",
  },
  licensing: {
    top: "bg-blue",
    badgeBg: "bg-blue/15",
    badgeText: "text-blue",
    badgeBorder: "border-blue/40",
    dot: "bg-blue",
  },
};

import { STATUS_CLASSES, STATUS_LABEL } from "@/lib/project-display";
import type { ProjectStatus } from "@/lib/types";

type StatusVisual = (typeof STATUS_CLASSES)[ProjectStatus];

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const c = STATUS_CLASSES[status];
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-[11px] tracking-wide ${c.badgeBg} ${c.badgeText} ${c.badgeBorder}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ReadinessBar({
  readiness,
  status,
}: {
  readiness: number;
  status: ProjectStatus;
}) {
  const c: StatusVisual = STATUS_CLASSES[status];
  return (
    <div
      className="flex flex-col gap-1.5"
      role="img"
      aria-label={`Readiness: ${readiness} of 3 stages complete`}
    >
      <div className="flex justify-between font-mono text-[9.5px] tracking-wide text-muted">
        <span>VALIDATION</span>
        <span>IP FILED</span>
        <span>COMMERCIAL</span>
      </div>
      <div className="flex h-1 gap-0.75">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`flex-1 rounded-full ${n <= readiness ? c.top : "bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}

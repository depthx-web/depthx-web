import Link from "next/link";
import type { Project } from "@/lib/types";
import { STATUS_CLASSES } from "@/lib/project-display";
import { ReadinessBar, StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format-date";

export function FlagshipCard({ project }: { project: Project }) {
  const c = STATUS_CLASSES[project.status];
  const meta = project.patentNumber
    ? `${project.patentNumberKind === "patent" ? "Patent No." : "Application No."} ${project.patentNumber}`
    : project.filedDate
      ? `Filed: ${formatDate(project.filedDate)}`
      : "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative grid grid-cols-1 overflow-hidden rounded-xl border border-line md:grid-cols-[1.3fr_1fr]"
    >
      <span className={`absolute inset-x-0 top-0 z-10 h-0.75 ${c.top}`} />
      <div className="order-first flex flex-col justify-center gap-2.5 border-b border-line bg-bg-3 p-8.5 md:order-none md:border-b-0 md:border-r">
        <span className="font-mono text-[10.5px] tracking-widest text-amber">
          {"// FLAGSHIP PROJECT"}
        </span>
        <h3 className="font-display text-[22px] leading-tight font-semibold">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>
      <div className="p-8.5">
        <div className="font-mono text-[11px] tracking-wide text-muted">
          {project.researchDomain.name.toUpperCase()}
        </div>
        <p className="my-3.5 text-sm leading-7 text-muted">{project.overview}</p>
        <div className="mb-4">
          <ReadinessBar readiness={project.readinessStage} status={project.status} />
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3.5 font-mono text-[11px] text-muted">
          <span>{meta}</span>
          <span className="flex items-center gap-1.5 font-semibold text-blue">
            Full Case Study
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { Project } from "@/lib/types";
import { STATUS_CLASSES } from "@/lib/project-display";
import { ReadinessBar, StatusBadge } from "@/components/ui/status-badge";
import { ClampedText } from "@/components/ui/clamped-text";
import { formatDate } from "@/lib/format-date";

export function ProjectCard({ project }: { project: Project }) {
  const c = STATUS_CLASSES[project.status];
  const meta = project.patentNumber
    ? `${project.patentNumberKind === "patent" ? "Patent No." : "Application No."} ${project.patentNumber}`
    : project.filedDate
      ? `Filed: ${formatDate(project.filedDate)}`
      : "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-line bg-gradient-to-b from-bg-2 to-bg-3 p-7 transition-transform duration-300 hover:-translate-y-1 hover:border-line-2"
    >
      <span className={`absolute inset-x-0 top-0 h-0.75 ${c.top}`} />
      <StatusBadge status={project.status} />
      <div className="font-mono text-[11px] tracking-wide text-muted">
        {project.researchDomain.name.toUpperCase()}
      </div>
      <div className="font-display text-xl font-semibold leading-tight">{project.title}</div>
      <div className="flex-grow">
        <ClampedText text={project.shortDescription} lines={3} className="text-sm leading-7 text-muted" />
      </div>
      <ReadinessBar readiness={project.readinessStage} status={project.status} />
      <div className="flex items-center justify-between border-t border-line pt-3.5 font-mono text-[11px] text-muted">
        <span>{meta}</span>
        <span className="flex items-center gap-1.5 font-semibold text-blue">
          Details
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

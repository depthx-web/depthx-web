import {
  DEVELOPMENT_STAGES,
  commercialStatusLabel,
  developmentStageLabel,
  developmentStagePosition,
  ipStatusLabel,
  projectPublicStatusLine,
  shouldShowCommercialStatus,
  shouldShowIpStatus,
} from "@/lib/project-status";
import type { CommercialStatus, DevelopmentStage, IpStatus, Project } from "@/lib/types";

const IP_BADGE_CLASSES: Record<IpStatus, string> = {
  not_filed: "border-line bg-bg-3 text-muted",
  application_preparation: "border-line bg-bg-3 text-muted",
  ip_filed: "border-blue/40 bg-blue/15 text-blue",
  patent_pending: "border-amber/40 bg-amber/15 text-amber",
  patent_granted: "border-green/40 bg-green/15 text-green",
};

const COMMERCIAL_BADGE_CLASSES: Record<CommercialStatus, string> = {
  not_offered: "border-line bg-bg-3 text-muted",
  commercialization_planning: "border-line bg-bg-3 text-muted",
  available_for_licensing: "border-blue/40 bg-blue/15 text-blue",
  licensed: "border-green/40 bg-green/15 text-green",
  commercial_operation: "border-green/40 bg-green/15 text-green",
};

export function IpStatusBadge({ status, showAll = false }: { status: IpStatus; showAll?: boolean }) {
  if (!showAll && !shouldShowIpStatus(status)) return null;
  return (
    <span
      className={`inline-flex w-fit items-center rounded border px-3 py-1.5 font-mono text-[11px] tracking-wide ${IP_BADGE_CLASSES[status]}`}
    >
      {ipStatusLabel(status, true)}
    </span>
  );
}

export function CommercialStatusBadge({ status }: { status: CommercialStatus }) {
  if (!shouldShowCommercialStatus(status)) return null;
  return (
    <span
      className={`inline-flex w-fit items-center rounded border px-3 py-1.5 font-mono text-[11px] tracking-wide ${COMMERCIAL_BADGE_CLASSES[status]}`}
    >
      {commercialStatusLabel(status, true)}
    </span>
  );
}

export function ProjectStatusLine({ project }: { project: Project }) {
  return (
    <span className="font-mono text-[11px] tracking-wide text-amber">
      {projectPublicStatusLine(project)}
    </span>
  );
}

export function DevelopmentProgress({
  stage,
  accentClass = "bg-amber",
}: {
  stage: DevelopmentStage;
  accentClass?: string;
}) {
  const position = developmentStagePosition(stage);
  return (
    <div
      className="flex flex-col gap-1.5"
      role="img"
      aria-label={`Product development stage: ${position} of ${DEVELOPMENT_STAGES.length}, ${developmentStageLabel(stage)}`}
    >
      <div className="flex justify-between gap-3 font-mono text-[9.5px] tracking-wide text-muted">
        <span>PRODUCT DEVELOPMENT</span>
        <span>{developmentStageLabel(stage).toUpperCase()}</span>
      </div>
      <div className="flex h-1 gap-0.75">
        {DEVELOPMENT_STAGES.map((option, index) => (
          <div
            key={option.value}
            className={`flex-1 rounded-full ${index < position ? accentClass : "bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}

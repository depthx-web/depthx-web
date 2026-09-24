import type {
  CommercialStatus,
  DevelopmentStage,
  IpStatus,
  Project,
  ProjectStatus,
  ReadinessStage,
} from "@/lib/types";

type StatusOption<T extends string> = {
  value: T;
  adminLabel: string;
  publicLabel: string;
};

export const DEVELOPMENT_STAGES: readonly StatusOption<DevelopmentStage>[] = [
  { value: "research_concept", adminLabel: "Research / Concept", publicLabel: "RESEARCH / CONCEPT" },
  {
    value: "system_architecture",
    adminLabel: "System Architecture / Pre-Prototype",
    publicLabel: "PRE-PROTOTYPE",
  },
  { value: "prototype_engineering", adminLabel: "Prototype Engineering", publicLabel: "PROTOTYPE ENGINEERING" },
  { value: "prototype_built", adminLabel: "Prototype Built", publicLabel: "PROTOTYPE BUILT" },
  { value: "technical_validation", adminLabel: "Technical Validation", publicLabel: "TECHNICAL VALIDATION" },
  { value: "pilot_preparation", adminLabel: "Pilot Preparation", publicLabel: "PILOT PREPARATION" },
  { value: "pilot", adminLabel: "Pilot", publicLabel: "PILOT" },
  { value: "validation_complete", adminLabel: "Validation Complete", publicLabel: "VALIDATION COMPLETE" },
] as const;

export const IP_STATUSES: readonly StatusOption<IpStatus>[] = [
  { value: "not_filed", adminLabel: "Not Filed", publicLabel: "NOT FILED" },
  {
    value: "application_preparation",
    adminLabel: "Application in Preparation",
    publicLabel: "APPLICATION IN PREPARATION",
  },
  { value: "ip_filed", adminLabel: "IP Filed", publicLabel: "IP FILED" },
  { value: "patent_pending", adminLabel: "Patent Pending", publicLabel: "PATENT-PENDING" },
  { value: "patent_granted", adminLabel: "Patent Granted", publicLabel: "PATENT GRANTED" },
] as const;

export const COMMERCIAL_STATUSES: readonly StatusOption<CommercialStatus>[] = [
  { value: "not_offered", adminLabel: "Not Yet Offered", publicLabel: "NOT YET OFFERED" },
  {
    value: "commercialization_planning",
    adminLabel: "Commercialization Planning",
    publicLabel: "COMMERCIALIZATION PLANNING",
  },
  {
    value: "available_for_licensing",
    adminLabel: "Available for Licensing",
    publicLabel: "AVAILABLE FOR LICENSING",
  },
  { value: "licensed", adminLabel: "Licensed", publicLabel: "LICENSED" },
  {
    value: "commercial_operation",
    adminLabel: "In Commercial Operation",
    publicLabel: "IN COMMERCIAL OPERATION",
  },
] as const;

const developmentByValue = new Map(DEVELOPMENT_STAGES.map((option) => [option.value, option]));
const ipByValue = new Map(IP_STATUSES.map((option) => [option.value, option]));
const commercialByValue = new Map(COMMERCIAL_STATUSES.map((option) => [option.value, option]));

export function isDevelopmentStage(value: unknown): value is DevelopmentStage {
  return typeof value === "string" && developmentByValue.has(value as DevelopmentStage);
}

export function isIpStatus(value: unknown): value is IpStatus {
  return typeof value === "string" && ipByValue.has(value as IpStatus);
}

export function isCommercialStatus(value: unknown): value is CommercialStatus {
  return typeof value === "string" && commercialByValue.has(value as CommercialStatus);
}

export function developmentStageLabel(value: DevelopmentStage, publicLabel = false): string {
  const option = developmentByValue.get(value);
  return publicLabel ? option?.publicLabel ?? value : option?.adminLabel ?? value;
}

export function ipStatusLabel(value: IpStatus, publicLabel = false): string {
  const option = ipByValue.get(value);
  return publicLabel ? option?.publicLabel ?? value : option?.adminLabel ?? value;
}

export function commercialStatusLabel(value: CommercialStatus, publicLabel = false): string {
  const option = commercialByValue.get(value);
  return publicLabel ? option?.publicLabel ?? value : option?.adminLabel ?? value;
}

export function developmentStagePosition(value: DevelopmentStage): number {
  const index = DEVELOPMENT_STAGES.findIndex((option) => option.value === value);
  return index < 0 ? 1 : index + 1;
}

export function shouldShowIpStatus(value: IpStatus): boolean {
  return value === "ip_filed" || value === "patent_pending" || value === "patent_granted";
}

export function shouldShowCommercialStatus(value: CommercialStatus): boolean {
  return value === "available_for_licensing" || value === "licensed" || value === "commercial_operation";
}

export function projectPublicStatusParts(project: Project): string[] {
  return [
    shouldShowIpStatus(project.ipStatus) ? ipStatusLabel(project.ipStatus, true) : null,
    developmentStageLabel(project.developmentStage, true),
    project.nextMilestone?.trim() ? project.nextMilestone.trim().toUpperCase() : null,
    shouldShowCommercialStatus(project.commercialStatus)
      ? commercialStatusLabel(project.commercialStatus, true)
      : null,
  ].filter((part): part is string => Boolean(part));
}

export function projectPublicStatusLine(project: Project): string {
  return projectPublicStatusParts(project).join(" · ");
}

// Temporary compatibility for rows created before the multi-axis fields exist.
export function legacyDevelopmentStage(value: number): DevelopmentStage {
  if (value >= 3) return "technical_validation";
  if (value >= 2) return "system_architecture";
  return "research_concept";
}

export function legacyIpStatus(value: ProjectStatus): IpStatus {
  if (value === "pending") return "patent_pending";
  return "ip_filed";
}

export function legacyCommercialStatus(value: ProjectStatus): CommercialStatus {
  return value === "licensing" ? "available_for_licensing" : "not_offered";
}

export function legacyReadinessStage(value: DevelopmentStage): ReadinessStage {
  const position = developmentStagePosition(value);
  if (position >= 5) return 3;
  if (position >= 2) return 2;
  return 1;
}
